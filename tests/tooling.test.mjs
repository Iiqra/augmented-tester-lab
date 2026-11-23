// Checks the repo's own tooling, so the exercises keep working. Runs without a device.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import yaml from 'js-yaml';
import { parseEnv } from '../scripts/maestro.mjs';
import { toRegex, extractSelectors, check } from '../chapters/01-gen-ai-in-software-testing/04-hallucination-check/check-selectors.mjs';

const CH = 'chapters/01-gen-ai-in-software-testing';
const FLOWS = `${CH}/03-ai-assisted-ui-flows/flows`;
const flowFiles = (dir) => readdirSync(dir).filter((f) => f.endsWith('.yaml')).map((f) => path.join(dir, f));

test('labels.env parses and defines every variable the flows use', () => {
  const vars = parseEnv(readFileSync(`${CH}/03-ai-assisted-ui-flows/labels.env`, 'utf8'));
  const flowVarsAllowed = new Set(['TASK', 'TWODOS_EMAIL', 'TWODOS_PASSWORD']);
  for (const f of [...flowFiles(FLOWS), ...flowFiles(`${FLOWS}/subflows`)]) {
    for (const [, name] of readFileSync(f, 'utf8').matchAll(/\$\{(\w+)\}/g)) {
      assert.ok(name in vars || flowVarsAllowed.has(name), `${f} uses \${${name}} which is not defined`);
    }
  }
});

test('every flow is valid YAML with an appId header and a command list', () => {
  for (const f of [...flowFiles(FLOWS), ...flowFiles(`${FLOWS}/subflows`)]) {
    const docs = yaml.loadAll(readFileSync(f, 'utf8'));
    assert.equal(docs.length, 2, `${f} should have a header and commands`);
    assert.ok(docs[0].appId, `${f} has no appId`);
    assert.ok(Array.isArray(docs[1]), `${f} commands are not a list`);
  }
});

test('every runFlow file reference exists', () => {
  for (const f of flowFiles(FLOWS)) {
    for (const [, ref] of readFileSync(f, 'utf8').matchAll(/(?:runFlow:\s*|file:\s*)(subflows\/[\w-]+\.yaml)/g)) {
      assert.ok(existsSync(path.join(FLOWS, ref)), `${f} references missing ${ref}`);
    }
  }
});

test('toRegex handles (?i) and full-match semantics', () => {
  assert.ok(toRegex('(?i)clear all completed').test('Clear all completed'));
  assert.ok(!toRegex('Add').test('Add new todo'));
});

test('extractSelectors finds text, relational and conditional selectors', () => {
  const sels = extractSelectors([{ tapOn: 'A' }, { tapOn: { leftOf: 'B' } }, { runFlow: { when: { visible: 'C' }, commands: [{ assertVisible: { text: 'D', checked: true } }] } }]);
  assert.deepEqual(new Set(sels.map((s) => s.selector)), new Set(['A', 'B', 'C', 'D']));
});

test('the checker flags exactly the three invented labels in the constructed example', () => {
  const { results } = check({ flows: `${CH}/04-hallucination-check/examples`, captures: `${CH}/04-hallucination-check/examples/captures`, labelsFile: 'none' });
  const missing = [...new Set(results.filter((r) => r.status === 'MISSING').map((r) => r.resolved))];
  assert.deepEqual(missing.sort(), ['Add new todo', 'Completed (1)', 'Mark complete']);
});

test('coverage maps every acceptance criterion', () => {
  const out = execFileSync('node', [`${CH}/02-test-cases-from-a-story/coverage.mjs`], { encoding: 'utf8' });
  assert.match(out, /0 uncovered/);
});

test('compare-runs reports criteria no run covered and invented references', () => {
  const out = execFileSync('node', [`${CH}/05-non-determinism/compare-runs.mjs`], { encoding: 'utf8' });
  assert.match(out, /no run covered this/);
  assert.match(out, /AC9/);
});
