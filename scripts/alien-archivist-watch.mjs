#!/usr/bin/env node
// Checks the Alien Archivist Substack for posts we have not ingested yet.
//
//   npm run archivist:check            -> list new posts (newest first)
//   npm run archivist:check -- --json  -> same, as JSON (title, subtitle, date, url, cover image)
//   npm run archivist:check -- --mark  -> list, then record them in scripts/alien-archivist-seen.json
//   npm run archivist:check -- --quick -> stop at the first page with nothing new (faster routine check)
//
// "Seen" means "already turned into a data point on the site" — only pass --mark after the posts
// have actually been added. The seen file is committed so the state travels with the repo.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SEEN_PATH = join(HERE, 'alien-archivist-seen.json');
const ARCHIVE = 'https://alienarchivist.substack.com/api/v1/archive?sort=new';
const PAGE = 12;
const args = new Set(process.argv.slice(2));

const seen = JSON.parse(readFileSync(SEEN_PATH, 'utf8'));
const seenIds = new Set(seen.map((p) => p.id));

async function page(offset) {
  const res = await fetch(`${ARCHIVE}&offset=${offset}&limit=${PAGE}`, { headers: { 'User-Agent': 'Mozilla/5.0 (MTRH archivist watch)' } });
  if (!res.ok) throw new Error(`Substack archive returned HTTP ${res.status}`);
  return res.json();
}

const fresh = [];
for (let offset = 0; offset < 2000; offset += PAGE) {
  const posts = await page(offset);
  if (!posts.length) break;
  let allSeen = true;
  for (const p of posts) {
    if (seenIds.has(p.id)) continue;
    allSeen = false;
    fresh.push({ id: p.id, slug: p.slug, title: p.title, subtitle: p.subtitle || '', date: p.post_date.slice(0, 10), url: p.canonical_url, cover: p.cover_image || '' });
  }
  // Full scan by default (the archive is ~100 posts, a handful of requests) so older gaps show up too.
  // --quick stops at the first page that is entirely known, which is enough for a routine check.
  if (allSeen && args.has('--quick')) break;
}

if (args.has('--json')) {
  console.log(JSON.stringify(fresh, null, 1));
} else if (!fresh.length) {
  console.log(`No new Alien Archivist posts (${seen.length} already tracked).`);
} else {
  console.log(`${fresh.length} new Alien Archivist post(s) not yet on the site:\n`);
  for (const p of fresh) console.log(`${p.date}  ${p.title}\n            ${p.url}`);
}

if (args.has('--mark') && fresh.length) {
  const merged = [...fresh.map(({ cover, ...p }) => p), ...seen].sort((a, b) => (a.date < b.date ? 1 : -1));
  writeFileSync(SEEN_PATH, JSON.stringify(merged, null, 1) + '\n');
  console.log(`\nRecorded ${fresh.length} post(s) in ${SEEN_PATH}`);
}
