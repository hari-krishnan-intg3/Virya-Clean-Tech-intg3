# LinkedIn Leadership Intelligence Workbook

`extract_linkedin_leadership.py` builds an Excel workbook from the company input
sheet, with a company inventory, ten prioritized leadership slots per company,
search candidates, and validation flags.

## Input and output

By default the script reads `extracted_companies_consolidated.xlsx`, sheet
`All_400_Records`, and writes `linkedin_leadership_intelligence.xlsx` beside
the script. Use `--input`, `--sheet`, and `--output` to choose different paths.
The current workbook contains 400 company records; it is not a 5,000-company
file. Supply the actual 5,000-company workbook if that is the intended source.

## Build a review workbook without web search

```powershell
python extract_linkedin_leadership.py
```

This creates all company rows and ten leadership slots per company. Profile
fields remain blank and are marked `NOT_RESEARCHED`; the script never invents
names or profile links.

## Optional public-result discovery

The script can use the Brave Search API to find public search-result candidates.
It does not sign in to LinkedIn, crawl LinkedIn profile pages, or bypass access
controls. Search snippets may be incomplete, stale, or mismatched; all candidates
are marked for manual verification. Previous experience, skills, locations,
employee count, and company overview remain blank unless present in the input or
a reviewable source. No source snippet is treated as verified profile content.

Set a Brave Search API key in the environment, then run:

```powershell
$env:BRAVE_SEARCH_API_KEY = "your-key"
python extract_linkedin_leadership.py --search --limit-companies 5
python extract_linkedin_leadership.py --search
```

The first command is a small access check. The full run makes up to two API
requests per company and is subject to API access, rate limits, and cost. A
failed lookup is recorded in the workbook as `SEARCH_ERROR`; it is not silently
represented as a successful search. The key is read from the environment and is
not written to the workbook.

## Validation flags

- `NOT_RESEARCHED`: no online discovery was run.
- `NOT_FOUND_IN_SEARCH`: the search returned no matching candidate; this is not
  proof that no profile exists.
- `SEARCH_ERROR`: the search provider returned an error.
- `URL_FORMAT_VALID_NEEDS_REVIEW`: the URL resembles a LinkedIn company/profile
  URL, but ownership and currentness have not been verified.
- `NEEDS_MANUAL_REVIEW`: details came from search result metadata and require
  confirmation.
- `VERIFIED_BY_HUMAN`: reserved for a reviewer to select after checking the
  profile and evidence.

The source workbook itself should also be checked for accuracy and provenance
before its company details are treated as verified.
