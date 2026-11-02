#!/usr/bin/env python3
"""Build a reviewable LinkedIn leadership workbook from public search results.

This script does not log in to, crawl, or scrape LinkedIn. Optional discovery
uses the Brave Search API and stores only its public result titles, URLs, and
snippets. Search results are leads for human verification, not verified facts.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from openpyxl import Workbook, load_workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation


FOLDER = Path(__file__).resolve().parent
DEFAULT_INPUT = FOLDER / "extracted_companies_consolidated.xlsx"
DEFAULT_OUTPUT = FOLDER / "linkedin_leadership_intelligence.xlsx"
SOURCE_SHEET = "All_400_Records"
BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search"

ROLES = [
    ("Chief Executive Officer (CEO)", r"\b(ceo|chief executive officer|president|managing director)\b"),
    ("Chief Operating Officer (COO)", r"\b(coo|chief operating officer)\b"),
    ("Chief Technology Officer (CTO)", r"\b(cto|chief technology officer)\b"),
    ("Chief Information Officer (CIO)", r"\b(cio|chief information officer)\b"),
    ("Chief Financial Officer (CFO)", r"\b(cfo|chief financial officer)\b"),
    ("Chief Marketing Officer (CMO)", r"\b(cmo|chief marketing officer)\b"),
    ("Chief Revenue Officer (CRO)", r"\b(cro|chief revenue officer)\b"),
    ("Chief Product Officer (CPO)", r"\b(cpo|chief product officer)\b"),
    ("Chief Data/Digital Officer (CDO)", r"\b(cdo|chief (data|digital) officer)\b"),
    ("Other C-level / key business leader", r"\b(chair(man|person)?|founder|vice president|vp|director)\b"),
]

COMPANY_EXTRA_HEADERS = [
    "LinkedInCompanyURL",
    "CompanyLinkedInValidationFlag",
    "CompanyOverview",
    "Industry",
    "EmployeeCount",
    "Headquarters",
    "CompanyEvidenceURL",
    "CompanyValidationNotes",
]
LEADERSHIP_HEADERS = [
    "CompanyName",
    "CompanyWebsite",
    "CompanyLinkedInURL",
    "ExecutivePriority",
    "TargetLeadershipTitle",
    "FullName",
    "CurrentDesignation",
    "ExecutiveLinkedInProfileURL",
    "Location",
    "DepartmentFunction",
    "ProfessionalSummaryOrSearchSnippet",
    "PreviousExperience",
    "SkillsAndExpertise",
    "CompanyAssociation",
    "EvidenceSourceURL",
    "ExecutiveProfileValidationFlag",
    "DataValidationFlag",
    "ValidationNotes",
]
CANDIDATE_HEADERS = [
    "CompanyName",
    "ResultType",
    "MatchedLeadershipTitle",
    "ResultTitle",
    "ResultURL",
    "SearchResultSnippet",
    "ValidationFlag",
]
VALIDATION_FLAGS = (
    "NOT_RESEARCHED,NOT_FOUND_IN_SEARCH,SEARCH_ERROR,"
    "URL_FORMAT_VALID_NEEDS_REVIEW,NEEDS_MANUAL_REVIEW,VERIFIED_BY_HUMAN"
)


def text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def is_linkedin_url(value: str, kind: str) -> bool:
    path = "company" if kind == "company" else "in"
    return bool(
        re.match(
            rf"^https?://([a-z0-9-]+\.)?linkedin\.com/{path}/[^/\s?#]+/?(?:\?.*)?$",
            value.strip(),
            re.IGNORECASE,
        )
    )


def matched_role(value: str) -> str:
    for role, pattern in ROLES:
        if re.search(pattern, value, re.IGNORECASE):
            return role
    return ""


def result_name(title: str) -> str:
    clean_title = re.sub(r"\s*\|\s*LinkedIn\s*$", "", title, flags=re.IGNORECASE).strip()
    name = re.split(r"\s(?:-|—|\|)\s", clean_title, maxsplit=1)[0].strip()
    return name if 1 <= len(name) <= 100 else ""


class BraveSearch:
    def __init__(self, api_key: str, delay_seconds: float) -> None:
        self.api_key = api_key
        self.delay_seconds = delay_seconds
        self.last_request = 0.0

    def search(self, query: str, count: int = 20) -> list[dict[str, Any]]:
        wait = self.delay_seconds - (time.monotonic() - self.last_request)
        if wait > 0:
            time.sleep(wait)
        params = urllib.parse.urlencode({"q": query, "count": min(max(count, 1), 20)})
        request = urllib.request.Request(
            f"{BRAVE_SEARCH_URL}?{params}",
            headers={
                "Accept": "application/json",
                "X-Subscription-Token": self.api_key,
                "User-Agent": "LeadershipIntelligenceResearch/1.0",
            },
        )
        self.last_request = time.monotonic()
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = json.load(response)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
            raise RuntimeError(f"Brave Search request failed: {error}") from error
        results = payload.get("web", {}).get("results", [])
        if not isinstance(results, list):
            raise RuntimeError("Brave Search returned an unexpected results shape.")
        return results


def load_companies(input_path: Path, sheet_name: str) -> tuple[list[str], list[dict[str, Any]]]:
    workbook = load_workbook(input_path, read_only=True, data_only=True)
    if sheet_name not in workbook.sheetnames:
        raise ValueError(
            f"Sheet {sheet_name!r} not found in {input_path}. "
            f"Available sheets: {', '.join(workbook.sheetnames)}"
        )
    sheet = workbook[sheet_name]
    iterator = sheet.iter_rows(values_only=True)
    try:
        headers = [text(value) for value in next(iterator)]
    except StopIteration:
        raise ValueError(f"Input sheet {sheet_name!r} is empty.") from None
    if "Company_Name" not in headers:
        raise ValueError(f"Input sheet {sheet_name!r} has no 'Company_Name' column.")
    rows = []
    for values in iterator:
        row = dict(zip(headers, values))
        if text(row.get("Company_Name")):
            rows.append(row)
    workbook.close()
    if not rows:
        raise ValueError(f"No company rows found in {input_path}, sheet {sheet_name!r}.")
    return headers, rows


def company_query(company: str) -> str:
    return f'site:linkedin.com/company "{company}"'


def leader_query(company: str) -> str:
    titles = (
        '"CEO" OR "Chief Executive Officer" OR "COO" OR "Chief Operating Officer" OR '
        '"CTO" OR "Chief Technology Officer" OR "CIO" OR "Chief Information Officer" OR '
        '"CFO" OR "Chief Financial Officer" OR "CMO" OR "Chief Marketing Officer" OR '
        '"CRO" OR "Chief Revenue Officer" OR "CPO" OR "Chief Product Officer" OR '
        '"Chief Data Officer" OR "Chief Digital Officer" OR "Founder"'
    )
    return f'site:linkedin.com/in "{company}" {titles}'


def find_company_profile(
    results: list[dict[str, Any]], candidates: list[dict[str, str]], company: str
) -> tuple[str, str]:
    for result in results:
        url = text(result.get("url"))
        title = text(result.get("title"))
        snippet = text(result.get("description"))
        if is_linkedin_url(url, "company"):
            candidates.append(
                {
                    "CompanyName": company,
                    "ResultType": "Company page",
                    "MatchedLeadershipTitle": "",
                    "ResultTitle": title,
                    "ResultURL": url,
                    "SearchResultSnippet": snippet,
                    "ValidationFlag": "URL_FORMAT_VALID_NEEDS_REVIEW",
                }
            )
            return url, url
    return "", ""


def add_leadership_candidates(
    company: str,
    results: list[dict[str, Any]],
    candidates: list[dict[str, str]],
) -> dict[str, dict[str, str]]:
    matched: dict[str, dict[str, str]] = {}
    seen_urls: set[str] = set()
    for result in results:
        url = text(result.get("url"))
        title = text(result.get("title"))
        snippet = text(result.get("description"))
        if not is_linkedin_url(url, "profile") or url in seen_urls:
            continue
        seen_urls.add(url)
        role = matched_role(f"{title} {snippet}")
        candidate = {
            "CompanyName": company,
            "ResultType": "Individual profile",
            "MatchedLeadershipTitle": role,
            "ResultTitle": title,
            "ResultURL": url,
            "SearchResultSnippet": snippet,
            "ValidationFlag": "URL_FORMAT_VALID_NEEDS_REVIEW",
        }
        candidates.append(candidate)
        if role and role not in matched:
            matched[role] = candidate
    return matched


def style_sheet(sheet: Any, widths: dict[str, int] | None = None) -> None:
    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = sheet.dimensions
    sheet.row_dimensions[1].height = 30
    for cell in sheet[1]:
        sheet.column_dimensions[cell.column_letter].width = min(max(len(str(cell.value or "")) + 3, 14), 38)
    for cell in sheet[1]:
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="17365D")
        cell.alignment = Alignment(wrap_text=True, vertical="center")
    for row in sheet.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)
    if widths:
        for column, width in widths.items():
            sheet.column_dimensions[column].width = width
    sheet.sheet_view.showGridLines = False


def write_workbook(
    output_path: Path,
    source_headers: list[str],
    companies: list[dict[str, Any]],
    search: BraveSearch | None,
    limit_companies: int | None,
) -> dict[str, int]:
    selected = companies[:limit_companies] if limit_companies else companies
    workbook = Workbook()
    summary = workbook.active
    summary.title = "Start Here"
    company_sheet = workbook.create_sheet("Companies")
    leadership = workbook.create_sheet("Leadership")
    candidates_sheet = workbook.create_sheet("Search Candidates")
    candidates_records: list[dict[str, str]] = []

    summary_rows = [
        ("Purpose", "Reviewable company and leadership intelligence workbook."),
        ("Input", str(DEFAULT_INPUT.name)),
        ("Companies in source", len(companies)),
        ("Companies processed", len(selected)),
        ("Leadership slots", len(selected) * len(ROLES)),
        ("Discovery method", "Brave Search API result metadata only; no LinkedIn login or page scraping."),
        ("Important", "Search snippets are leads only. Verify identity, current role, company association, and each detail from an authoritative source before use."),
        ("Validation", "URL_FORMAT_VALID_NEEDS_REVIEW confirms URL shape only; it does not confirm ownership, accuracy, or current employment."),
        ("Missing data", "Blank fields mean not present in the input or search snippet; the script does not infer previous experience, skills, location, employee count, or company overview."),
        ("Search API", "Optional discovery requires BRAVE_SEARCH_API_KEY and the --search flag. API access/quotas may limit full-batch execution."),
        ("Generated UTC", datetime.now(timezone.utc).isoformat(timespec="seconds")),
    ]
    summary.append(["Item", "Details"])
    for row in summary_rows:
        summary.append(list(row))

    company_headers = source_headers + COMPANY_EXTRA_HEADERS
    company_sheet.append(company_headers)
    leadership.append(LEADERSHIP_HEADERS)
    candidates_sheet.append(CANDIDATE_HEADERS)

    errors = 0
    profile_hits = 0
    company_hits = 0
    for company_row in selected:
        company_name = text(company_row.get("Company_Name"))
        website = text(company_row.get("Official_Website"))
        company_url = ""
        company_url_flag = "NOT_RESEARCHED" if search is None else "NOT_FOUND_IN_SEARCH"
        company_evidence = ""
        company_notes = "No profile was verified. Company profile data not present in source."
        role_candidates: dict[str, dict[str, str]] = {}
        search_error = ""
        leader_search_error = ""

        if search is not None:
            try:
                company_results = search.search(company_query(company_name))
                company_url, company_evidence = find_company_profile(
                    company_results, candidates_records, company_name
                )
                if company_url:
                    company_url_flag = "URL_FORMAT_VALID_NEEDS_REVIEW"
                    company_hits += 1
                company_notes = (
                    "Search-result match only; confirm official company identity and details manually."
                )
            except RuntimeError as error:
                errors += 1
                search_error = str(error)
                company_url_flag = "SEARCH_ERROR"
                company_notes = f"Search failed: {search_error}"
            try:
                leader_results = search.search(leader_query(company_name))
                role_candidates = add_leadership_candidates(
                    company_name, leader_results, candidates_records
                )
                profile_hits += len(role_candidates)
            except RuntimeError as error:
                errors += 1
                leader_search_error = str(error)

        company_sheet.append(
            [company_row.get(header, "") for header in source_headers]
            + [
                company_url,
                company_url_flag,
                "",
                text(company_row.get("Industry_Category")),
                "",
                "",
                company_evidence,
                company_notes,
            ]
        )

        for priority, (role, _pattern) in enumerate(ROLES, start=1):
            result = role_candidates.get(role)
            if result:
                name = result_name(result["ResultTitle"])
                profile_flag = "URL_FORMAT_VALID_NEEDS_REVIEW"
                detail_flag = "NEEDS_MANUAL_REVIEW"
                notes = "Search title/snippet only; confirm profile owner, role, and current company association."
                title = result["ResultTitle"]
                profile_url = result["ResultURL"]
                snippet = result["SearchResultSnippet"]
                evidence_url = result["ResultURL"]
            else:
                name = title = profile_url = snippet = evidence_url = ""
                if search is None:
                    profile_flag = detail_flag = "NOT_RESEARCHED"
                    notes = "Online discovery was not run."
                else:
                    profile_flag = detail_flag = "NOT_FOUND_IN_SEARCH"
                    notes = "No matching profile found in this search; this does not prove no such leader exists."
                if leader_search_error:
                    profile_flag = detail_flag = "SEARCH_ERROR"
                    notes = leader_search_error
            leadership.append(
                [
                    company_name,
                    website,
                    company_url,
                    priority,
                    role,
                    name,
                    title,
                    profile_url,
                    "",
                    role if result else "",
                    snippet,
                    "",
                    "",
                    company_name if result else "",
                    evidence_url,
                    profile_flag,
                    detail_flag,
                    notes,
                ]
            )

    for candidate in candidates_records:
        candidates_sheet.append([candidate.get(header, "") for header in CANDIDATE_HEADERS])

    summary.append(["Company LinkedIn URL candidates", company_hits])
    summary.append(["Leadership role matches", profile_hits])
    summary.append(["Company search errors", errors])
    summary.append(["Unverified candidates", "All search candidates require human verification."])
    summary.freeze_panes = "A2"
    summary.column_dimensions["A"].width = 32
    summary.column_dimensions["B"].width = 110
    style_sheet(company_sheet)
    style_sheet(leadership)
    style_sheet(candidates_sheet)
    for sheet in (company_sheet, leadership, candidates_sheet):
        validation = DataValidation(type="list", formula1=f'"{VALIDATION_FLAGS}"', allow_blank=False)
        sheet.add_data_validation(validation)
        headers = [cell.value for cell in sheet[1]]
        if sheet.max_row > 1:
            for header in ("CompanyLinkedInValidationFlag", "ExecutiveProfileValidationFlag", "DataValidationFlag", "ValidationFlag"):
                if header in headers:
                    col = headers.index(header) + 1
                    validation.add(f"{sheet.cell(2, col).coordinate}:{sheet.cell(sheet.max_row, col).coordinate}")
        for header in ("ValidationNotes", "CompanyValidationNotes", "ProfessionalSummaryOrSearchSnippet", "SearchResultSnippet"):
            if header in headers:
                column_letter = sheet.cell(1, headers.index(header) + 1).column_letter
                sheet.column_dimensions[column_letter].width = 60
    flag_fill = PatternFill("solid", fgColor="FFF2CC")
    for sheet in (company_sheet, leadership, candidates_sheet):
        headers = [cell.value for cell in sheet[1]]
        for flag_name in ("CompanyLinkedInValidationFlag", "ExecutiveProfileValidationFlag", "DataValidationFlag", "ValidationFlag"):
            if flag_name in headers and sheet.max_row > 1:
                column_letter = sheet.cell(1, headers.index(flag_name) + 1).column_letter
                sheet.conditional_formatting.add(
                    f"{column_letter}2:{column_letter}{sheet.max_row}",
                    FormulaRule(formula=[f'{column_letter}2<>"VERIFIED_BY_HUMAN"'], fill=flag_fill),
                )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    workbook.save(output_path)
    return {
        "companies": len(selected),
        "leadership_slots": len(selected) * len(ROLES),
        "company_profile_candidates": company_hits,
        "leadership_role_matches": profile_hits,
        "search_errors": errors,
        "search_candidates": len(candidates_records),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Input company workbook.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Output intelligence workbook.")
    parser.add_argument("--sheet", default=SOURCE_SHEET, help="Company source worksheet.")
    parser.add_argument("--search", action="store_true", help="Use Brave Search API to find public result candidates.")
    parser.add_argument("--limit-companies", type=int, help="Process only the first N companies (useful for testing API access).")
    parser.add_argument("--delay-seconds", type=float, default=1.0, help="Minimum spacing between API requests.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.limit_companies is not None and args.limit_companies < 1:
        raise ValueError("--limit-companies must be greater than zero.")
    if args.delay_seconds < 0:
        raise ValueError("--delay-seconds cannot be negative.")
    source_headers, companies = load_companies(args.input, args.sheet)
    search_client = None
    if args.search:
        api_key = os.environ.get("BRAVE_SEARCH_API_KEY", "").strip()
        if not api_key:
            raise ValueError("--search requires BRAVE_SEARCH_API_KEY in the environment.")
        search_client = BraveSearch(api_key, args.delay_seconds)
    counts = write_workbook(args.output, source_headers, companies, search_client, args.limit_companies)
    print(f"Saved {args.output}")
    print(f"Companies: {counts['companies']}; leadership slots: {counts['leadership_slots']}")
    if search_client:
        print(
            f"Search candidates: {counts['search_candidates']}; "
            f"matched leadership roles: {counts['leadership_role_matches']}; "
            f"search errors: {counts['search_errors']}"
        )
    else:
        print("Offline template generated; profiles are marked NOT_RESEARCHED.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, RuntimeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
