#!/usr/bin/env python3
"""Concurrent contact extraction for screener_companies_full.csv.

This uses the existing Web Mining/contact_miner.py extraction rules, while
processing independent company websites concurrently and checkpointing each
completed row so the job can resume safely.
"""

import argparse
import csv
import logging
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Dict, List

CURRENT_DIR = Path(__file__).resolve().parent
WEB_MINING_DIR = CURRENT_DIR.parent
sys.path.insert(0, str(WEB_MINING_DIR))
from contact_miner import WebMiningContactAgent, read_input_csv  # noqa: E402

FIELDNAMES = [
    "company_name", "website_url", "contact_page_url", "emails",
    "phone_numbers", "linkedin_url", "twitter_url", "address",
    "pages_visited", "scrape_status", "screener_url",
]

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%H:%M:%S")
logger = logging.getLogger("FastContactMiner")


def mine_one(item: Dict[str, str], max_subpages: int, timeout: int) -> Dict[str, str]:
    agent = WebMiningContactAgent(timeout=timeout, max_subpages=max_subpages, delay_seconds=0)
    try:
        result = agent.mine_company(item["company_name"], item["website_url"])
        return {
            "company_name": result.company_name,
            "website_url": result.website_url,
            "contact_page_url": result.contact_page_url,
            "emails": "; ".join(sorted(result.emails)[:8]),
            "phone_numbers": "; ".join(sorted(result.phone_numbers)[:8]),
            "linkedin_url": result.linkedin_url,
            "twitter_url": result.twitter_url,
            "address": result.address,
            "pages_visited": str(result.pages_visited),
            "scrape_status": result.scrape_status,
            "screener_url": item.get("screener_url", ""),
        }
    except Exception as exc:
        logger.warning("Failed %s: %s", item.get("company_name", ""), exc)
        return {field: item.get(field, "") for field in FIELDNAMES} | {
            "scrape_status": f"ERROR: {exc}",
            "pages_visited": "0",
        }


def run(input_csv: Path, output_csv: Path, workers: int, max_subpages: int, timeout: int, limit: int | None) -> None:
    companies = read_input_csv(str(input_csv))
    if limit:
        companies = companies[:limit]
    completed: Dict[str, Dict[str, str]] = {}
    if output_csv.exists():
        with output_csv.open("r", encoding="utf-8-sig", newline="") as stream:
            for row in csv.DictReader(stream):
                if row.get("screener_url"):
                    completed[row["screener_url"]] = row
    pending = [item for item in companies if item.get("screener_url") not in completed]
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    logger.info("Loaded %d companies; %d already complete; %d pending", len(companies), len(completed), len(pending))
    with ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        futures = {pool.submit(mine_one, item, max_subpages, timeout): item for item in pending}
        for index, future in enumerate(as_completed(futures), start=1):
            item = futures[future]
            row = future.result()
            completed[item["screener_url"]] = row
            ordered = [completed.get(company["screener_url"]) for company in companies]
            with output_csv.open("w", encoding="utf-8", newline="") as stream:
                writer = csv.DictWriter(stream, fieldnames=FIELDNAMES)
                writer.writeheader()
                writer.writerows(row for row in ordered if row)
            logger.info("contact %d/%d: %s -> %s", index, len(pending), item["company_name"], row["scrape_status"])
    logger.info("Wrote %d contact rows to %s", len(completed), output_csv)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=CURRENT_DIR / "screener_companies_full.csv")
    parser.add_argument("--output", type=Path, default=CURRENT_DIR / "company_contacts_full.csv")
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--max-subpages", type=int, default=3)
    parser.add_argument("--timeout", type=int, default=12)
    parser.add_argument("--limit", type=int, default=None)
    args = parser.parse_args()
    run(args.input, args.output, args.workers, args.max_subpages, args.timeout, args.limit)


if __name__ == "__main__":
    main()
