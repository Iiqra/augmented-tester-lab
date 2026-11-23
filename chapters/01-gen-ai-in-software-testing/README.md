# Chapter 1 · Gen AI in software testing

Hands-on exercises for chapter 1 of *The Augmented Tester*, practised on the **twodos iOS app**
(see [docs/twodos-under-test.md](../../docs/twodos-under-test.md) and [docs/setup-ios.md](../../docs/setup-ios.md)).

| # | Book section | Exercise | AI does | You do |
|---|---|---|---|---|
| 01 | Where AI fits in the lifecycle | [Lifecycle prompts](01-lifecycle/) | Drafts a strategy, reviews a story, ranks regression candidates | Add real product context, judge each output |
| 02 | Writing test cases, then and now | [Test cases from a story](02-test-cases-from-a-story/) | Generates cases from a twodos user story | Review, de-duplicate, map every acceptance criterion |
| 03 | Automating a feature, then and now | [AI-assisted UI flows](03-ai-assisted-ui-flows/) | Explores the app and drafts Maestro flows | Give context, review, run, correct |
| 04 | Hallucination | [Selector check](04-hallucination-check/) | Writes flows that may tap labels the app never shows | Check every selector against captured screens |
| 05 | Non-deterministic behaviour | [Compare runs](05-non-determinism/) | Gives a different set of cases on each run | Compare runs, merge, check coverage |
| 06 | Overconfidence | [Prove the fix](06-overconfidence/) | Says "found it, here is the fix" | Ask for evidence, repeat runs before accepting |
| 07 | Working rules | [Template and checklist](07-working-rules/) | Follows a structured prompt | Apply the six rules to every output |

## Run it

```bash
npm install
npm run ch1:coverage           # acceptance criteria -> test cases (and which are automated)
npm run ch1:compare-runs       # compare several AI runs of the same prompt
npm run flows:capture          # screenshots of the real screens (simulator required)
npm run ch1:check-selectors    # are the flows' labels really on screen?
npm run flows                  # run all chapter 1 flows on the iOS simulator
npm run flows:repeat -- <flow> # one flow 10 times, to prove a fix
```
