// Step 1 of the codex audit: bundle the TS data modules and dump them as JSON into scripts/codex-audit/.out
//   node scripts/codex-audit/dump-data.mjs && python3 -I scripts/codex-audit/codex-audit.py
// Bundle the TS data modules with esbuild and dump them as JSON for the codex audit.
import { build } from 'esbuild';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = resolve(PROJ, 'scripts', 'codex-audit', '.out');
mkdirSync(OUT, { recursive: true });
const require = createRequire(import.meta.url);

async function load(file) {
  const out = `${OUT}/_bundle_${file.replace(/[^a-z0-9]/gi, '_')}.cjs`;
  await build({ entryPoints: [`${PROJ}/src/${file}`], bundle: true, format: 'cjs', platform: 'node', outfile: out, logLevel: 'silent', loader: { '.json': 'json' } });
  delete require.cache[out];
  return require(out);
}

const tt = await load('termTreeData.ts');
const tl = await load('timelineData.ts');
const layers = await load('layers.ts');
writeFileSync(`${OUT}/termTree.json`, JSON.stringify(tt.TERM_TREE_DATA));
writeFileSync(`${OUT}/timeline.json`, JSON.stringify({ items: tl.TIMELINE_ITEMS, locations: Object.keys(tl.TIMELINE_LOCATIONS || {}) }));
writeFileSync(`${OUT}/layers.json`, JSON.stringify(Object.keys(layers.LAYER_CONFIG || layers.default || {})));

// Collect every map feature id from every data source App.tsx can show.
const ids = new Set();
const addAll = (arr) => { for (const r of arr || []) if (r && r.id) ids.add(String(r.id)); };
for (const f of ['archaeologyData.ts', 'oldWorldStructuresData.ts', 'alienSightingsData.ts', 'alienAbductionData.ts', 'cattleMutilationData.ts', 'cavesData.ts', 'dataCentersData.ts', 'missing411Data.ts', 'vanishedShipsAircraftData.ts']) {
  try { const m = await load(f); for (const v of Object.values(m)) if (Array.isArray(v)) addAll(v); } catch (e) { console.error('skip', f, e.message); }
}
for (const f of ['rabbitHoleData.json', 'brazilianUfoData.json', 'ufoData-1.json', 'ufoData-2.json', 'warGovData.json', 'warGovData-2.json', 'warGovData-3.json', 'warGovData-4.json', 'warGovData-5.json', 'warGovData-6.json']) {
  try { const j = JSON.parse(readFileSync(`${PROJ}/src/${f}`, 'utf8')); addAll(Array.isArray(j) ? j : j.features || j.data || []); } catch (e) { console.error('skip', f, e.message); }
}
writeFileSync(`${OUT}/mapIds.json`, JSON.stringify([...ids]));
console.log('codex nodes', tt.TERM_TREE_DATA.length, '| timeline items', tl.TIMELINE_ITEMS.length, '| map ids', ids.size, '| layers', (Object.keys(layers.LAYER_CONFIG || {})).length);
