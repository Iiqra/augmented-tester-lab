# 04 · Hallucination check: labels that are not on screen

Book: *When convincing output is wrong*. An AI generated a page object from a DOM snapshot and invented
attributes that did not exist. In a mobile flow the equivalent is a `tapOn: "Add new todo"` for a button
the app never shows. The flow looks clean until it fails on the first tap.

`check-selectors.mjs` extracts every selector from the Maestro flows (resolving `${...}` from `labels.env`)
and checks it against labels captured from the real app.

## 1 · Try it on the constructed example

```bash
npm run ch1:check-selectors -- \
  --flows chapters/01-gen-ai-in-software-testing/04-hallucination-check/examples \
  --captures chapters/01-gen-ai-in-software-testing/04-hallucination-check/examples/captures --labels none
```
The example flow and its screen labels are **constructed for teaching**. Three labels are invented and get flagged.

## 2 · Run it on the real twodos flows

1. Capture the real screens into `captures/`: a hierarchy JSON from the Maestro MCP server or your
   Maestro version, or a `.txt` file with the visible labels you read from `npm run flows:capture` screenshots.
2. `npm run ch1:check-selectors`
3. Fix every `MISSING` value in `03-ai-assisted-ui-flows/labels.env`, then run the flows.
