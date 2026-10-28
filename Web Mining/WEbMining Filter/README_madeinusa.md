# Made in USA Directory Extraction

This workflow queries the public U.S. Department of Commerce Made in USA Directory API used by its search form. The four U.S. headquarters filters are California, North Carolina, New York, and New Jersey; these differ from Maharashtra, Karnataka, Tamil Nadu, and Delhi in the existing workbook.

The script applies one headquarters-state filter per model, requests results in pages of 16, and caps extraction at 100 records per state. The source currently has fewer than 100 records for some selected states, so the summary reports source totals and marks those state filters partial. It does not synthesize or pad records. The directory does not expose a date-range filter.

## Run

From this folder:

```powershell
python -m pip install -r requirements_madeinusa.txt
python extract_madeinusa.py
```

## Outputs

- `madeinusa_extracted.csv`: consolidated records
- `madeinusa_extracted.json`: summary and consolidated records
- `madeinusa_extracted_summary.csv`: count and completion status by state/filter
- `madeinusa_extracted.xlsx`: summary, all records, and one review sheet per state filter

The filter definitions, API endpoint, page size, and per-state cap are in `madeinusa_filters.json`. Contact details are reproduced from the directory's public company listings; the source URL and UTC extraction timestamp are included on each record.