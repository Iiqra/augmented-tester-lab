// Flags API calls in the code that are not defined in the twodos OpenAPI spec.
// Book, chapter 1: AI output can sound convincing and still be wrong. Check it against the real system.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const withExamples = process.argv.includes('--examples');
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

// 1. Load the spec: full live spec if fetched, else the documented fallback list.
async function loadSpec() {
  try {
    const spec = JSON.parse(await readFile(path.join(root, 'spec/openapi.json'), 'utf8'));
    const eps = Object.entries(spec.paths).flatMap(([p, ops]) =>
      Object.keys(ops).filter((m) => METHODS.includes(m)).map((m) => `${m.toUpperCase()} ${p}`));
    return { eps, source: 'spec/openapi.json' };
  } catch {
    const doc = JSON.parse(await readFile(path.join(root, 'spec/documented-endpoints.json'), 'utf8'));
    return { eps: doc.endpoints, source: 'spec/documented-endpoints.json (run `npm run spec:fetch` for the full spec)' };
  }
}
const norm = (p) => p.split('?')[0].replace(/\$\{[^}]+\}/g, '{}').replace(/\{[^}]+\}/g, '{}').replace(/\/+$/, '');

// 2. Collect code files to scan.
async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'mock', 'test-results', 'playwright-report'].includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name === 'examples' && !withExamples) continue; await walk(full, out); }
    else if (/\.(ts|mjs|js)$/.test(e.name) && !full.endsWith('check-endpoints.mjs')) out.push(full);
  }
  return out;
}

// 3. Extract calls like request.post('/api/..') or call('post', `/api/..`).
const patterns = [
  /\.(get|post|put|patch|delete)\(\s*[`'"](\/(?:api|health)[^`'"]*)[`'"]/g,
  /['"](get|post|put|patch|delete)['"]\s*,\s*[`'"](\/(?:api|health)[^`'"]*)[`'"]/g,
];

const { eps, source } = await loadSpec();
const known = new Set(eps.map((e) => { const [m, p] = e.split(' '); return `${m} ${norm(p)}`; }));
const findings = [];
for (const file of await walk(root)) {
  const text = await readFile(file, 'utf8');
  for (const re of patterns) for (const m of text.matchAll(re)) {
    const call = `${m[1].toUpperCase()} ${norm(m[2])}`;
    const line = text.slice(0, m.index).split('\n').length;
    findings.push({ call, raw: `${m[1].toUpperCase()} ${m[2]}`, where: `${path.relative(root, file)}:${line}`, ok: known.has(call) });
  }
}

console.log(`\nChecking ${findings.length} API calls against ${source}\n`);
for (const f of findings) console.log(`${f.ok ? 'OK     ' : 'MISSING'}  ${f.raw.padEnd(52)} ${f.where}`);
const bad = findings.filter((f) => !f.ok);
console.log(bad.length ? `\n${bad.length} call(s) use endpoints that are not in the spec. Treat them as hallucinations until proven otherwise.` : '\nAll calls match documented endpoints.');
process.exit(bad.length ? 1 : 0);
