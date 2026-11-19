// Maps acceptance criteria (user-story.md) to test cases (reviewed-test-cases.json).
// Usage: node coverage.mjs [path/to/cases.json]
// Book: every acceptance criterion needs at least one case; extra cases need a reason to exist.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const casesPath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(here, 'reviewed-test-cases.json');
const story = await readFile(path.join(here, 'user-story.md'), 'utf8');
const cases = JSON.parse(await readFile(casesPath, 'utf8'));

const criteria = [...story.matchAll(/^\|\s*(AC\d+)\s*\|\s*([^|]+)\|/gm)].map(([, id, text]) => ({ id, text: text.trim() }));
const known = new Set(criteria.map((c) => c.id));

console.log(`\nCoverage for ${path.relative(process.cwd(), casesPath)}\n`);
let gaps = 0;
for (const c of criteria) {
  const hits = cases.filter((t) => (t.covers || []).includes(c.id)).map((t) => t.id);
  if (!hits.length) gaps++;
  console.log(`${hits.length ? 'OK  ' : 'GAP '} ${c.id.padEnd(4)} ${c.text.slice(0, 64).padEnd(64)} ${hits.join(', ') || '-'}`);
}
const unmapped = cases.filter((t) => !(t.covers || []).length).map((t) => t.id);
const unknownRefs = cases.flatMap((t) => (t.covers || []).filter((a) => !known.has(a)).map((a) => `${t.id}->${a}`));
const open = cases.filter((t) => /\bOPEN:|ASSUMPTION/.test(t.expected || '')).map((t) => t.id);

console.log(`\n${criteria.length} criteria, ${cases.length} cases, ${gaps} uncovered`);
if (unmapped.length) console.log(`Cases not mapped to any criterion (keep only if they add value): ${unmapped.join(', ')}`);
if (unknownRefs.length) console.log(`References to criteria that do not exist (possible AI invention): ${unknownRefs.join(', ')}`);
if (open.length) console.log(`Cases with open questions or assumptions to resolve: ${open.join(', ')}`);
process.exit(gaps || unknownRefs.length ? 1 : 0);
