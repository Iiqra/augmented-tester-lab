// Runs Maestro flows with the UI labels from labels.env and the secrets from .env.
//   node scripts/maestro.mjs <flow file or folder> [more...]
//   node scripts/maestro.mjs --repeat 10 <flow file>     run N times and report pass/fail counts
// Requires the Maestro CLI and a booted iOS simulator with twodos installed (see docs/setup-ios.md).
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const labelsFile = path.join(root, 'chapters/01-gen-ai-in-software-testing/03-ai-assisted-ui-flows/labels.env');

export function parseEnv(text) {
  const out = {};
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+#.*$/, '').trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  let repeat = 1;
  const r = args.indexOf('--repeat');
  if (r >= 0) { repeat = Number(args[r + 1]); args.splice(r, 2); }
  if (!args.length) { console.error('Give a flow file or folder.'); process.exit(2); }

  const env = { ...parseEnv(readFileSync(labelsFile, 'utf8')) };
  const secrets = path.join(root, '.env');
  if (existsSync(secrets)) Object.assign(env, parseEnv(readFileSync(secrets, 'utf8')));
  if (!env.APP_ID || env.APP_ID === 'com.example.twodos') console.warn('WARNING: APP_ID in labels.env is still the placeholder.');

  const envArgs = Object.entries(env).flatMap(([k, v]) => ['-e', `${k}=${v}`]);
  mkdirSync(path.join(root, 'reports'), { recursive: true });

  let passed = 0;
  for (let i = 1; i <= repeat; i++) {
    const res = spawnSync('maestro', ['test', '--platform=ios', ...envArgs,
      '--format=JUNIT', `--output=${path.join(root, 'reports', `run-${i}.xml`)}`,
      `--test-output-dir=${path.join(root, 'reports', `artifacts-${i}`)}`, ...args], { stdio: 'inherit' });
    if (res.error) { console.error('Could not start maestro. Is the Maestro CLI installed and on PATH?'); process.exit(2); }
    if (res.status === 0) passed++;
    if (repeat > 1) console.log(`\nrun ${i}/${repeat}: ${res.status === 0 ? 'PASS' : 'FAIL'}`);
  }
  if (repeat > 1) console.log(`\n${passed}/${repeat} runs passed. A fix is proven only when every run passes.`);
  process.exit(passed === repeat ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
