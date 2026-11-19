# 03 · AI-assisted API tests

Book: *Automating a feature, then and now*. The book's example uses an agent driving a browser.
twodos has no web app, so the same workflow is applied to its REST API:

1. Give the model the **reviewed test cases** and the **existing client** (`src/twodos-client.ts`), not a blank page.
2. Ask it to write tests that follow the client's patterns. Use [prompt.md](prompt.md).
3. Save the raw output as `ai-draft.spec.ts.txt` (not run by Playwright) so the review is visible.
4. Review it with [../07-working-rules/review-checklist.md](../07-working-rules/review-checklist.md), then run it.
5. The reviewed, passing version lives in [tasks.spec.ts](tasks.spec.ts).

```bash
npm run test:mock                               # against the local mock
TWODOS_BASE_URL=https://... npm test            # against an environment you own, with a test account
```
