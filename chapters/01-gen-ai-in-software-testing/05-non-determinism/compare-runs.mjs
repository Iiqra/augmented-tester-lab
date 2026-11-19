// Compares several AI runs of the same test-case prompt.
// Shows criteria covered per run, criteria no run covered, and scenarios that appear in only one run.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const runsDir = path.join(here, 'runs');
const story = await readFile(path.join(here, '../02-test-cases-from-a-story/user-story.md'), 'utf8');
const criteria = [...story.matchAll(/^\|\s*(AC\d+)\s*\|/gm)].map((m) => m[1]);

let files = (await readdir(runsDir)).filter((f) => /^run-\d+\.json$/.test(f)).sort();
let sample = false;
if (!files.length) { files = (await readdir(runsDir)).filter((f) => f.startsWith('format-sample-run-')).sort(); sample = true; }
if (files.length < 2) { console.log('Add at least two runs to runs/ (run-1.json, run-2.json, ...)'); process.exit(1); }

const runs = await Promise.all(files.map(async (f) => ({ name: f.replace('.json', ''), cases: JSON.parse(await readFile(path.join(runsDir, f), 'utf8')) })));
if (sample) console.log('\nUsing FORMAT SAMPLES (hand-written, not AI output). Add your own runs/run-N.json files.');

console.log('\nCriteria coverage per run\n');
console.log('      ' + runs.map((r) => r.name.slice(-5).padStart(7)).join(''));
for (const ac of criteria) {
  const row = runs.map((r) => (r.cases.some((c) => (c.covers || []).includes(ac)) ? '   yes ' : '    -  '));
  const none = row.every((c) => c.includes('-'));
  console.log(`${ac.padEnd(6)}${row.join('')}${none ? '   <- no run covered this' : ''}`);
}

const key = (t) => t.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const seen = new Map();
for (const r of runs) for (const c of r.cases) { const k = key(c.title); seen.set(k, [...(seen.get(k) || []), r.name]); }
const onlyOnce = [...seen].filter(([, rs]) => rs.length === 1);
console.log(`\nScenarios found in only one run (${onlyOnce.length}):`);
for (const [t, [r]] of onlyOnce) console.log(`  - ${t}  [${r}]`);

const invented = runs.flatMap((r) => r.cases.flatMap((c) => (c.covers || []).filter((a) => !criteria.includes(a)).map((a) => `${r.name}: "${c.title}" -> ${a}`)));
if (invented.length) { console.log('\nReferences to criteria that are not in the story (check for invented requirements):'); invented.forEach((x) => console.log('  - ' + x)); }
console.log('\nNo single run is the full picture. Merge, review and re-check coverage.');
