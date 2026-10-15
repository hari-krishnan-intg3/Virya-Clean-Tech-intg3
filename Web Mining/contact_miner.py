#!/usr/bin/env python3
"""
Web Mining Agent for Company Contact Extraction
================================================
Reads the CSV generated from Screener.in (`screener_companies.csv`), navigates
to each company's official website, discovers contact/about/investor subpages,
extracts contact details (emails, phone numbers, social links, and postal
addresses), and writes the enriched dataset to an output CSV file.

Usage:
    python contact_miner.py --input screener_companies.csv --output company_contacts_enriched.csv

Dependencies:
    pip install requests beautifulsoup4 urllib3
"""

import argparse
import csv
import json
import logging
import re
import sys
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set, Tuple
from urllib.parse import urljoin, urlparse

import requests
import urllib3
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Suppress insecure SSL warnings when falling back on misconfigured corporate certs
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("ContactMiner")


# === REGEX PATTERNS & FILTERS ===

EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,10}\b"
)

# Matches Indian (+91, 022, 1800 toll-free) and standard international phone formats
PHONE_REGEX = re.compile(
    r"(?:(?:\+|00)\d{1,3}[\s.\-]?)?"
    r"(?:\(?\d{2,5}\)?[\s.\-]?)"
    r"\d{3,4}[\s.\-]?\d{3,5}\b"
)

# Keywords to identify high-value contact, investor, or office pages
CONTACT_LINK_KEYWORDS = (
    "contact",
    "reach-us",
    "reach_us",
    "reachus",
    "get-in-touch",
    "connect",
    "enquiry",
    "inquiry",
    "investor",
    "locate",
    "office",
    "support",
    "about-us",
    "about",
)

IGNORED_EMAIL_EXTENSIONS = (
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".css",
    ".js",
    ".woff",
    ".woff2",
    ".ttf",
    ".ico",
)

IGNORED_EMAIL_DOMAINS = {
    "example.com",
    "domain.com",
    "email.com",
    "yoursite.com",
    "company.com",
    "sentry.io",
    "wixpress.com",
}

SOCIAL_PLATFORMS = {
    "linkedin": ("linkedin.com/company/", "linkedin.com/in/"),
    "twitter": ("twitter.com/", "x.com/"),
    "facebook": ("facebook.com/",),
    "youtube": ("youtube.com/",),
}


@dataclass
class CompanyContactResult:
    company_name: str
    website_url: str
    contact_page_url: str = ""
    emails: Set[str] = field(default_factory=set)
    phone_numbers: Set[str] = field(default_factory=set)
    linkedin_url: str = ""
    twitter_url: str = ""
    address: str = ""
    pages_visited: int = 0
    scrape_status: str = "PENDING"


class WebMiningContactAgent:
    """Crawls corporate websites and extracts structured contact details."""

    def __init__(
        self,
        timeout: int = 12,
        max_subpages: int = 3,
        delay_seconds: float = 1.0,
    ) -> None:
        self.timeout = timeout
        self.max_subpages = max_subpages
        self.delay_seconds = delay_seconds
        self.session = self._build_session()

    @staticmethod
    def _build_session() -> requests.Session:
        session = requests.Session()
        retry_strategy = Retry(
            total=2,
            backoff_factor=0.8,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["HEAD", "GET", "OPTIONS"],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        session.headers.update(
            {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/128.0.0.0 Safari/537.36"
                ),
                "Accept": (
                    "text/html,application/xhtml+xml,application/xml;q=0.9,"
                    "image/avif,image/webp,*/*;q=0.8"
                ),
                "Accept-Language": "en-US,en;q=0.9",
            }
        )
        return session

    @staticmethod
    def normalize_url(raw_url: str) -> str:
        url = (raw_url or "").strip()
        if not url:
            return ""
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        return url

    def fetch_html(self, url: str) -> Tuple[Optional[str], str]:
        """Fetches page HTML with automatic HTTPS->HTTP and SSL verification fallback."""
        try:
            resp = self.session.get(url, timeout=self.timeout, verify=True)
            resp.raise_for_status()
            if "text/html" not in resp.headers.get("Content-Type", "").lower():
                return None, resp.url
            return resp.text, resp.url
        except requests.exceptions.SSLError:
            try:
                resp = self.session.get(url, timeout=self.timeout, verify=False)
                resp.raise_for_status()
                return resp.text, resp.url
            except Exception as exc:
                logger.debug("SSL fallback failed for %s: %s", url, exc)
                return None, url
        except Exception as exc:
            # Try HTTP if HTTPS failed initially
            if url.startswith("https://"):
                http_url = "http://" + url[len("https://") :]
                try:
                    resp = self.session.get(
                        http_url, timeout=self.timeout, verify=False
                    )
                    resp.raise_for_status()
                    return resp.text, resp.url
                except Exception:
                    pass
            logger.debug("Failed to fetch %s: %s", url, exc)
            return None, url

    @staticmethod
    def clean_email(raw_email: str) -> Optional[str]:
        email = raw_email.strip().lower().rstrip(".,;:)[]>\"'")
        email = email.lstrip("(<[\"'")
        if not email or "@" not in email:
            return None
        if any(email.endswith(ext) for ext in IGNORED_EMAIL_EXTENSIONS):
            return None
        domain = email.split("@", 1)[1]
        if domain in IGNORED_EMAIL_DOMAINS:
            return None
        if len(email) > 80:
            return None
        return email

    @staticmethod
    def clean_phone(raw_phone: str) -> Optional[str]:
        # Escape hyphen or place it at the end of the character class to avoid range error
        cleaned = re.sub(r"[^\d+()\s\-]", "", raw_phone).strip()
        digits_only = re.sub(r"\D", "", cleaned)

        # Valid phone numbers generally have 10 to 13 digits (or 8-11 for landlines/toll-free)
        if len(digits_only) < 8 or len(digits_only) > 14:
            return None

        # Reject obvious year ranges (e.g. 2020-2025) or sequential placeholders
        if re.match(r"^(19|20)\d{2}\D+(19|20)\d{2}$", cleaned):
            return None
        if digits_only in {"0000000000", "1234567890", "9999999999"}:
            return None

        # Normalize whitespace
        normalized = re.sub(r"\s+", " ", cleaned)
        return normalized

    def extract_from_soup(
        self, soup: BeautifulSoup, page_url: str, result: CompanyContactResult
    ) -> None:
        """Extracts emails, phone numbers, social links, and addresses from a BeautifulSoup tree."""
        # 1. Extract from explicit mailto: and tel: links
        for anchor in soup.find_all("a", href=True):
            href = anchor["href"].strip()
            lower_href = href.lower()

            if lower_href.startswith("mailto:"):
                raw_addr = href[7:].split("?")[0]
                for part in re.split(r"[,;/\s]+", raw_addr):
                    cleaned_email = self.clean_email(part)
                    if cleaned_email:
                        result.emails.add(cleaned_email)

            elif lower_href.startswith("tel:"):
                raw_tel = href[4:].split("?")[0]
                cleaned_tel = self.clean_phone(raw_tel)
                if cleaned_tel:
                    result.phone_numbers.add(cleaned_tel)

            elif lower_href.startswith(("http://", "https://")):
                if not result.linkedin_url and any(
                    p in lower_href for p in SOCIAL_PLATFORMS["linkedin"]
                ):
                    result.linkedin_url = href
                if not result.twitter_url and any(
                    p in lower_href for p in SOCIAL_PLATFORMS["twitter"]
                ):
                    result.twitter_url = href

        # 2. Extract from JSON-LD structured data (Schema.org Organization / ContactPoint)
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "")
                self._extract_json_ld(data, result)
            except Exception:
                pass

        # 3. Remove script/style noise before scanning visible text
        for tag in soup(["script", "style", "noscript", "svg"]):
            tag.decompose()

        text_content = soup.get_text(separator=" ", strip=True)

        # De-obfuscate common "[at]" / "(at)" patterns
        deobfuscated_text = re.sub(
            r"\s*[\[\(]\s*at\s*[\]\)]\s*", "@", text_content, flags=re.IGNORECASE
        )

        for match in EMAIL_REGEX.findall(deobfuscated_text):
            cleaned_email = self.clean_email(match)
            if cleaned_email:
                result.emails.add(cleaned_email)

        for match in PHONE_REGEX.findall(text_content):
            cleaned_phone = self.clean_phone(match)
            if cleaned_phone:
                result.phone_numbers.add(cleaned_phone)

        # 4. Extract physical address from <address> tag or blocks labeled "Registered Office"
        if not result.address:
            addr_tag = soup.find("address")
            if addr_tag:
                addr_text = re.sub(
                    r"\s+", " ", addr_tag.get_text(separator=", ", strip=True)
                )
                if 15 <= len(addr_text) <= 300:
                    result.address = addr_text

            if not result.address:
                office_match = re.search(
                    r"(?:Registered\s+Office|Corporate\s+Office|Head\s+Office)\s*[:\-]?\s*([A-Za-z0-9,\s.\-/()]{20,220}?\b\d{6}\b)",
                    text_content,
                    flags=re.IGNORECASE,
                )
                if office_match:
                    result.address = re.sub(
                        r"\s+", " ", office_match.group(1)
                    ).strip()

    def _extract_json_ld(self, data: object, result: CompanyContactResult) -> None:
        if isinstance(data, list):
            for item in data:
                self._extract_json_ld(item, result)
            return

        if not isinstance(data, dict):
            return

        for key in ("email", "telephone", "phone"):
            val = data.get(key)
            if isinstance(val, str):
                if key == "email":
                    cleaned = self.clean_email(val)
                    if cleaned:
                        result.emails.add(cleaned)
                else:
                    cleaned = self.clean_phone(val)
                    if cleaned:
                        result.phone_numbers.add(cleaned)

        address_obj = data.get("address")
        if isinstance(address_obj, dict) and not result.address:
            parts = [
                str(address_obj.get(k, "")).strip()
                for k in (
                    "streetAddress",
                    "addressLocality",
                    "addressRegion",
                    "postalCode",
                    "addressCountry",
                )
                if address_obj.get(k)
            ]
            if parts:
                result.address = ", ".join(parts)

        for child_key in ("contactPoint", "@graph", "department", "location"):
            if child_key in data:
                self._extract_json_ld(data[child_key], result)

    def discover_contact_links(
        self, soup: BeautifulSoup, base_url: str
    ) -> List[str]:
        """Finds internal contact/about/investor links ranked by relevance."""
        base_domain = urlparse(base_url).netloc.lower().replace("www.", "")
        scored_links: Dict[str, int] = {}

        for anchor in soup.find_all("a", href=True):
            raw_href = anchor["href"].strip()
            if not raw_href or raw_href.startswith(
                ("#", "mailto:", "tel:", "javascript:")
            ):
                continue

            full_url = urljoin(base_url, raw_href).split("#")[0]
            parsed = urlparse(full_url)

            if parsed.scheme not in ("http", "https"):
                continue

            link_domain = parsed.netloc.lower().replace("www.", "")
            if link_domain != base_domain:
                continue

            # Skip binary assets / PDFs
            if parsed.path.lower().endswith(
                (".pdf", ".zip", ".jpg", ".png", ".doc", ".xlsx")
            ):
                continue

            combined_text = (
                f"{parsed.path.lower()} {(anchor.get_text() or '').strip().lower()}"
            )

            score = 0
            if "contact" in combined_text:
                score += 10
            elif any(
                kw in combined_text
                for kw in ("reach-us", "get-in-touch", "connect", "enquiry")
            ):
                score += 8
            elif any(kw in combined_text for kw in ("investor", "locate", "office")):
                score += 5
            elif "about" in combined_text:
                score += 2

            if score > 0 and full_url.rstrip("/") != base_url.rstrip("/"):
                scored_links[full_url] = max(scored_links.get(full_url, 0), score)

        sorted_urls = sorted(
            scored_links.keys(), key=lambda u: scored_links[u], reverse=True
        )
        return sorted_urls[: self.max_subpages]

    def mine_company(
        self, company_name: str, raw_website_url: str
    ) -> CompanyContactResult:
        """Navigates to the company website and mines contact details."""
        website_url = self.normalize_url(raw_website_url)
        result = CompanyContactResult(
            company_name=company_name, website_url=website_url
        )

        if not website_url:
            result.scrape_status = "NO_WEBSITE_URL"
            return result

        html, final_home_url = self.fetch_html(website_url)
        if not html:
            result.scrape_status = "UNREACHABLE"
            return result

        result.website_url = final_home_url
        result.pages_visited += 1

        home_soup = BeautifulSoup(html, "html.parser")
        contact_subpages = self.discover_contact_links(home_soup, final_home_url)
        self.extract_from_soup(home_soup, final_home_url, result)

        # Visit discovered contact/investor/about subpages
        for sub_url in contact_subpages:
            time.sleep(0.4)
            sub_html, resolved_sub_url = self.fetch_html(sub_url)
            if not sub_html:
                continue

            result.pages_visited += 1
            if not result.contact_page_url:
                result.contact_page_url = resolved_sub_url

            sub_soup = BeautifulSoup(sub_html, "html.parser")
            self.extract_from_soup(sub_soup, resolved_sub_url, result)

            # Stop early if we already found both emails and phone numbers
            if result.emails and result.phone_numbers and result.address:
                break

        if result.emails or result.phone_numbers:
            result.scrape_status = "SUCCESS"
        else:
            result.scrape_status = "VISITED_NO_CONTACTS_FOUND"

        return result


def read_input_csv(input_path: str) -> List[Dict[str, str]]:
    """Reads the CSV exported from the Screener.in JS snippet."""
    rows: List[Dict[str, str]] = []
    with open(input_path, mode="r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Support flexible column names from the JS snippet or custom CSVs
            company_name = (
                row.get("company_name")
                or row.get("Company")
                or row.get("name")
                or ""
            ).strip()
            website_url = (
                row.get("website_url")
                or row.get("Website")
                or row.get("website")
                or row.get("website_domain")
                or ""
            ).strip()
            screener_url = (
                row.get("screener_url") or row.get("Screener_URL") or ""
            ).strip()

            if company_name or website_url:
                rows.append(
                    {
                        "company_name": company_name,
                        "website_url": website_url,
                        "screener_url": screener_url,
                    }
                )
    return rows


def run_pipeline(
    input_csv: str,
    output_csv: str,
    max_subpages: int = 3,
    delay_seconds: float = 1.0,
    limit: Optional[int] = None,
) -> None:
    companies = read_input_csv(input_csv)
    if limit is not None and limit > 0:
        companies = companies[:limit]

    total = len(companies)
    if total == 0:
        logger.error("No company records found in %s", input_csv)
        sys.exit(1)

    logger.info(
        "Loaded %d companies from '%s'. Starting web mining...", total, input_csv
    )

    agent = WebMiningContactAgent(
        max_subpages=max_subpages, delay_seconds=delay_seconds
    )

    fieldnames = [
        "company_name",
        "website_url",
        "contact_page_url",
        "emails",
        "phone_numbers",
        "linkedin_url",
        "twitter_url",
        "address",
        "pages_visited",
        "scrape_status",
        "screener_url",
    ]

    with open(output_csv, mode="w", encoding="utf-8", newline="") as out_f:
        writer = csv.DictWriter(out_f, fieldnames=fieldnames)
        writer.writeheader()

        for idx, item in enumerate(companies, start=1):
            name = item["company_name"]
            url = item["website_url"]
            logger.info("[%d/%d] Mining %s (%s)...", idx, total, name, url or "N/A")

            contact_res = agent.mine_company(name, url)

            writer.writerow(
                {
                    "company_name": contact_res.company_name,
                    "website_url": contact_res.website_url,
                    "contact_page_url": contact_res.contact_page_url,
                    "emails": "; ".join(sorted(contact_res.emails)[:8]),
                    "phone_numbers": "; ".join(
                        sorted(contact_res.phone_numbers)[:8]
                    ),
                    "linkedin_url": contact_res.linkedin_url,
                    "twitter_url": contact_res.twitter_url,
                    "address": contact_res.address,
                    "pages_visited": contact_res.pages_visited,
                    "scrape_status": contact_res.scrape_status,
                    "screener_url": item.get("screener_url", ""),
                }
            )
            out_f.flush()

            logger.info(
                "   -> Status: %s | Emails: %d | Phones: %d",
                contact_res.scrape_status,
                len(contact_res.emails),
                len(contact_res.phone_numbers),
            )

            if idx < total:
                time.sleep(delay_seconds)

    logger.info("Completed! Enriched contact dataset saved to '%s'.", output_csv)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Web Mining Agent: Crawl company websites from CSV and extract contact details."
    )
    parser.add_argument(
        "-i",
        "--input",
        default="screener_companies.csv",
        help="Input CSV file generated by screener_scraper.js (default: screener_companies.csv)",
    )
    parser.add_argument(
        "-o",
        "--output",
        default="company_contacts_enriched.csv",
        help="Output CSV file with extracted contact details (default: company_contacts_enriched.csv)",
    )
    parser.add_argument(
        "--max-subpages",
        type=int,
        default=3,
        help="Maximum contact/about subpages to visit per company website (default: 3)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Delay in seconds between companies (default: 1.0)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Optional limit on number of companies to process for quick testing",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    run_pipeline(
        input_csv=args.input,
        output_csv=args.output,
        max_subpages=args.max_subpages,
        delay_seconds=args.delay,
        limit=args.limit,
    )