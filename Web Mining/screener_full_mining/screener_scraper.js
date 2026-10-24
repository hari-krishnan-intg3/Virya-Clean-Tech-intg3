#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { setTimeout: sleep } = require('node:timers/promises');

const ROOT = 'https://www.screener.in';
const SCREEN_PATH = '/screens/357649/all-listed-companies/';
const DEFAULT_PAGES = 222;
const DEFAULT_CONCURRENCY = 8;
const USER_AGENT = 'Mozilla/5.0 (compatible; ViryaCleanTechResearch/1.0; +https://www.screener.in/)';

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
  };
  return {
    pages: Number(get('pages', DEFAULT_PAGES)),
    concurrency: Number(get('concurrency', DEFAULT_CONCURRENCY)),
    detailConcurrency: Number(get('detail-concurrency', 12)),
    output: get('output', path.join(__dirname, 'screener_companies_full.csv')),
    checkpoint: get('checkpoint', path.join(__dirname, 'screener_companies_checkpoint.jsonl')),
    startPage: Number(get('start-page', 1)),
  };
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;|&#47;/g, '/');
}

function cleanText(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function csv(value) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function fetchText(url, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' } });
      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) await sleep(Math.min(3000 * attempt, 15000));
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(Math.min(1500 * attempt, 5000));
    }
  }
  throw new Error(`${url}: ${lastError.message}`);
}

function parseListPage(html) {
  const rows = [];
  const rowPattern = /<tr\b[^>]*>[\s\S]*?<\/tr>/gi;
  const linkPattern = /<a\b[^>]*href=["']([^"']*\/company\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>/i;
  for (const row of html.match(rowPattern) || []) {
    const match = row.match(linkPattern);
    if (!match) continue;
    const href = new URL(decodeHtml(match[1]), ROOT).href;
    rows.push({ company_name: cleanText(match[2]), screener_url: href });
  }
  return rows;
}

function parseOfficialWebsite(html, detailUrl) {
  const blockedHosts = /(?:^|\.)screener\.in$|(?:^|\.)bseindia\.com$|(?:^|\.)nseindia\.com$|(?:^|\.)sebi\.gov\.in$|(?:^|\.)google\.[^/]+$|(?:^|\.)google\.co\.[^/]+$|(?:^|\.)youtube\.com$|(?:^|\.)bitly\.com$/i;
  const linkPattern = /<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>[\s\S]*?<i[^>]*class=["'][^"']*icon-link[^"']*["'][^>]*>[\s\S]*?<\/a>/gi;
  for (const match of html.matchAll(linkPattern)) {
    const url = decodeHtml(match[1]).trim();
    if (!blockedHosts.test(new URL(url).hostname)) return url;
  }
  const fallback = html.match(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*target=["']_blank["'][^>]*>[\s\S]*?<span[^>]*>\s*([^<]+)\s*<\/span>/i);
  return fallback && !blockedHosts.test(new URL(fallback[1]).hostname) ? decodeHtml(fallback[1]) : '';
}

async function mapLimit(items, concurrency, worker) {
  let cursor = 0;
  const results = new Array(items.length);
  async function consume() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, consume));
  return results;
}

async function main() {
  const options = parseArgs();
  if (!Number.isInteger(options.pages) || options.pages < 1) throw new Error('--pages must be positive');
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  const checkpointRows = new Map();
  if (fs.existsSync(options.checkpoint)) {
    for (const line of fs.readFileSync(options.checkpoint, 'utf8').split('\n').filter(Boolean)) {
      const row = JSON.parse(line);
      checkpointRows.set(row.screener_url, row);
    }
  }
  const checkpointStream = fs.createWriteStream(options.checkpoint, { flags: 'a' });
  const pageNumbers = Array.from({ length: options.pages - options.startPage + 1 }, (_, i) => i + options.startPage);
  const pageRows = await mapLimit(pageNumbers, Math.min(options.concurrency, 4), async (page) => {
    const url = `${ROOT}${SCREEN_PATH}?page=${page}`;
    try {
      const rows = parseListPage(await fetchText(url, 6));
      console.log(`page ${page}/${options.pages}: ${rows.length} companies`);
      return rows;
    } catch (error) {
      console.error(`page ${page}/${options.pages}: ${error.message}`);
      return [];
    }
  });
  const companies = [...new Map(pageRows.flat().map((row) => [row.screener_url, row])).values()];
  console.log(`discovered ${companies.length} unique companies`);
  const unresolved = companies.filter((row) => {
    const saved = checkpointRows.get(row.screener_url);
    return !saved || String(saved.extraction_status || '').startsWith('ERROR');
  });
  await mapLimit(unresolved, options.detailConcurrency, async (company, index) => {
    let website_url = '';
    let status = 'NO_WEBSITE_FOUND';
    try {
      website_url = parseOfficialWebsite(await fetchText(company.screener_url), company.screener_url);
      status = website_url ? 'SUCCESS' : 'NO_WEBSITE_FOUND';
    } catch (error) {
      status = `ERROR: ${error.message}`;
    }
    const row = { ...company, website_url, extraction_status: status };
    checkpointRows.set(row.screener_url, row);
    checkpointStream.write(`${JSON.stringify(row)}\n`);
    console.log(`detail ${index + 1}/${unresolved.length}: ${row.company_name} -> ${website_url || status}`);
    return row;
  });
  await new Promise((resolve) => checkpointStream.end(resolve));
  const ordered = companies.map((company) => checkpointRows.get(company.screener_url)).filter(Boolean);
  const columns = ['company_name', 'website_url', 'screener_url', 'extraction_status'];
  const output = [columns.join(','), ...ordered.map((row) => columns.map((column) => csv(row[column])).join(','))].join('\n') + '\n';
  fs.writeFileSync(options.output, output, 'utf8');
  console.log(`wrote ${ordered.length} rows to ${options.output}`);
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
