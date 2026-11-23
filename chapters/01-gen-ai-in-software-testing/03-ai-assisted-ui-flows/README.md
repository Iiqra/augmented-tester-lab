# 03 · AI-assisted UI flows with Maestro

Book: *Automating a feature, then and now*. In the book, an AI agent opens a browser, runs the scenario,
observes the application and writes test code that follows the existing codebase. twodos is a mobile app,
so the same workflow uses **Maestro** on the **iOS simulator**:

| Book (web) | This repo (iOS) |
|---|---|
| Playwright | Maestro flows (YAML) |
| Playwright MCP lets the agent drive the browser | Maestro MCP lets the agent drive the simulator |
| DOM selectors and page objects | Visible text / accessibility labels, collected in [labels.env](labels.env), and reusable [subflows](flows/subflows/) |

## Workflow

1. **Give context, not a blank page.** Use [prompt.md](prompt.md) with the reviewed test cases and the existing flows.
2. **Let the agent explore** the running app through the Maestro MCP server, so labels come from what it actually sees.
3. **Review** the result with [the checklist](../07-working-rules/review-checklist.md) and run exercise 04 on it.
4. **Run** it: `npm run flows`. Keep only flows that pass.

## Status of the flows in this folder

| Flow | Case | Status |
|---|---|---|
| `00-capture-screens.yaml` | evidence | draft, run this first |
| `tc01-add-task.yaml` | TC01 | draft, not yet run |
| `tc02-empty-task.yaml` | TC02 | draft, depends on an open question |
| `tc03-complete-and-undo.yaml` | TC03 | draft, checkbox position assumed |
| `tc04-clear-completed.yaml` | TC04 | draft, not yet run |
| `tc08-persists-after-restart.yaml` | TC08 | draft, not yet run |

Every label they use is in [labels.env](labels.env) and is **unverified** until checked against a capture of
the real app. That is deliberate: it is the chapter's main lesson applied to the repo itself.
When a flow passes on a device, change its status line here.
