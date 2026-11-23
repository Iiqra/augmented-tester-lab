// Hallucination check for UI flows: does every element a flow relies on actually exist on screen?
// Book, chapter 1: an AI wrote a page object with attributes that were not in the DOM. The mobile
// equivalent is a flow that taps labels the app never shows. This script compares the selectors in
// Maestro flows with labels captured from the real app.
//
//   node check-selectors.mjs [--flows <dir|file>] [--captures <dir>] [--labels <labels.env|none>]
//
// Captures: put one or more files in captures/
//   *.json  a view-hierarchy dump (any JSON: every text / accessibilityText / label / identifier / id value is collected)
//   *.txt   one visible label per line, copied from screenshots or Maestro Studio (lines starting with # are ignored)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { parseEnv } from '../../../scripts/maestro.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const ch = path.resolve(here, '..');

const SELECTOR_COMMANDS = ['tapOn', 'doubleTapOn', 'longPressOn', 'assertVisible', 'copyTextFrom'];
const RELATIONS = ['leftOf', 'rightOf', 'above', 'below', 'childOf', 'containsChild'];
const LABEL_KEYS = new Set(['text', 'accessibilityText', 'accessibilityLabel', 'label', 'title', 'hintText', 'value', 'identifier', 'resource-id', 'id']);

export function toRegex(sel) {
  let src = String(sel).trim(), flags = '';
  if (src.startsWith('(?i)')) { src = src.slice(4); flags = 'i'; }
  try { return new RegExp(`^(?:${src})$`, flags); } catch { return new RegExp(`^${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, flags); }
}

/** Collect { selector, kind, command } from Maestro command lists, recursing into runFlow commands and relations. */
export function extractSelectors(commands, out = []) {
  const addSel = (val, command) => {
    if (val == null) return;
    if (typeof val === 'string') return out.push({ selector: val, kind: 'text', command });
    if (typeof val === 'object') {
      if (val.text) out.push({ selector: val.text, kind: 'text', command });
      if (val.id) out.push({ selector: val.id, kind: 'id', command });
      for (const r of RELATIONS) if (val[r]) addSel(val[r], `${command}.${r}`);
    }
  };
  for (const c of commands || []) {
    if (!c || typeof c !== 'object') continue;
    for (const [cmd, val] of Object.entries(c)) {
      if (SELECTOR_COMMANDS.includes(cmd)) addSel(val, cmd);
      if (cmd === 'scrollUntilVisible') addSel(val?.element, cmd);
      if (cmd === 'extendedWaitUntil') addSel(val?.visible, cmd);
      if (cmd === 'runFlow' && typeof val === 'object') {
        if (val.when?.visible) addSel(val.when.visible, 'runFlow.when');
        if (val.commands) extractSelectors(val.commands, out);
      }
      if (cmd === 'repeat' && val?.commands) extractSelectors(val.commands, out);
    }
  }
  return out;
}

export function collectLabels(node, out = new Set()) {
  if (Array.isArray(node)) node.forEach((n) => collectLabels(n, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (LABEL_KEYS.has(k) && typeof v === 'string' && v.trim()) out.add(v.trim());
      else collectLabels(v, out);
    }
  }
  return out;
}

function files(p, ext) {
  if (!existsSync(p)) return [];
  if (statSync(p).isFile()) return [p];
  return readdirSync(p).filter((f) => ext.some((e) => f.endsWith(e))).map((f) => path.join(p, f));
}

export function check({ flows, captures, labelsFile }) {
  const vars = labelsFile && labelsFile !== 'none' && existsSync(labelsFile) ? parseEnv(readFileSync(labelsFile, 'utf8')) : {};
  const labels = new Set();
  for (const f of files(captures, ['.json', '.txt'])) {
    const text = readFileSync(f, 'utf8');
    if (f.endsWith('.json')) collectLabels(JSON.parse(text), labels);
    else text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).forEach((l) => labels.add(l));
  }
  const results = [];
  for (const f of files(flows, ['.yaml', '.yml'])) {
    const docs = yaml.loadAll(readFileSync(f, 'utf8'));
    const commands = docs.find(Array.isArray) || [];
    for (const s of extractSelectors(commands)) {
      const resolved = s.selector.replace(/\$\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
      let status;
      if (/\$\{\w+\}/.test(resolved)) status = 'SKIP (test data)';
      else if (/^Lab:/.test(resolved)) status = 'SKIP (created by the flow)';
      else status = [...labels].some((l) => toRegex(resolved).test(l)) ? 'OK' : 'MISSING';
      results.push({ ...s, resolved, status, file: path.basename(f) });
    }
  }
  return { results, labelCount: labels.size };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (name, def) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; };
  const flows = path.resolve(arg('--flows', path.join(ch, '03-ai-assisted-ui-flows/flows')));
  const captures = path.resolve(arg('--captures', path.join(here, 'captures')));
  const labelsArg = arg('--labels', path.join(ch, '03-ai-assisted-ui-flows/labels.env'));
  const labelsFile = labelsArg === 'none' ? 'none' : path.resolve(labelsArg);
  const { results, labelCount } = check({ flows, captures, labelsFile });
  if (!labelCount) {
    console.log(`No captured labels found in ${path.relative(process.cwd(), captures)}.\nCapture the real screens first (see README.md in this folder), then run again.`);
    process.exit(2);
  }
  const seen = new Set();
  console.log(`\nChecking selectors against ${labelCount} labels captured from the app\n`);
  for (const r of results) {
    const key = `${r.resolved}|${r.status}`; if (seen.has(key)) continue; seen.add(key);
    console.log(`${r.status.padEnd(26)} ${r.kind.padEnd(4)} ${r.resolved.slice(0, 48).padEnd(48)} ${r.file}`);
  }
  const missing = [...new Set(results.filter((r) => r.status === 'MISSING').map((r) => r.resolved))];
  console.log(missing.length ? `\n${missing.length} selector(s) match nothing on the captured screens. Treat them as invented until proven otherwise.` : '\nEvery selector matches a label on the captured screens.');
  process.exit(missing.length ? 1 : 0);
}
