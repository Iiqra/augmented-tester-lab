# 05 · Non-deterministic behaviour: same prompt, different answers

Book: *Non-deterministic behaviour*. Ask for test cases that fully cover the same requirements
three times and you get three different sets. One run may include scenarios another misses.

1. Run the prompt from [02-test-cases-from-a-story/prompt.md](../02-test-cases-from-a-story/prompt.md) three times in fresh chats.
2. Save the raw outputs here as `runs/run-1.json`, `runs/run-2.json`, `runs/run-3.json`.
3. `npm run ch1:compare-runs` shows which criteria each run covered and which scenarios appear in only one run.
4. Merge the useful cases into `02-test-cases-from-a-story/reviewed-test-cases.json` and re-run `npm run ch1:coverage`.

Until you add your own runs, the script uses the `format-sample-run-*.json` files.
**These are hand-written format samples, not real AI output.** They only show the JSON shape and how the comparison reads.
