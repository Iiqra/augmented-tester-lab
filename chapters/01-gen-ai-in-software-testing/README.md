# Chapter 1 · Gen AI in software testing

Hands-on exercises for chapter 1 of *The Augmented Tester*, practised on [twodos](../../docs/twodos-under-test.md).

| # | Book section | Exercise | AI does | You do |
|---|---|---|---|---|
| 01 | Where AI fits in the lifecycle | [Lifecycle prompts](01-lifecycle/) | Drafts a strategy outline, reviews a story, proposes regression candidates | Add real product context, judge each output |
| 02 | Writing test cases, then and now | [Test cases from a story](02-test-cases-from-a-story/) | Generates cases from a twodos user story | Review, de-duplicate, map every acceptance criterion |
| 03 | Automating a feature, then and now | [AI-assisted API tests](03-ai-assisted-api-tests/) | Drafts Playwright API tests from the reviewed cases | Review, run, fix, keep only what is correct |
| 04 | Hallucination | [Hallucination check](04-hallucination-check/) | Writes client code that may call endpoints that do not exist | Validate every endpoint against the OpenAPI spec |
| 05 | Non-deterministic behaviour | [Compare runs](05-non-determinism/) | Gives a different set of cases on each run | Compare runs, merge, check coverage |
| 06 | Overconfidence | [Prove the fix](06-overconfidence/) | Says "found it, here is the fix" | Demand evidence, repeat runs before accepting |
| 07 | Working rules | [Template and checklist](07-working-rules/) | Follows a structured prompt | Applies the six rules to every output |

## Run it

```bash
npm install
npm run test:mock              # API tests against the local twodos mock
npm run ch1:coverage           # acceptance criteria -> test case coverage
npm run ch1:check-endpoints    # flag endpoints that are not in the spec
npm run ch1:compare-runs       # compare several AI runs of the same prompt
npm run test:repeat            # every test 10 times, to expose flakiness
```
