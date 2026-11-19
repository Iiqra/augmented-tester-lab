# 06 · Overconfidence: prove the fix before you accept it

Book: *Overconfidence* and *Lack of real reasoning*. A model answers "I found the issue, here is the fix"
with no sign of doubt, even when the root cause has not been found. It also recommends tools without
asking about your team, stack or resources.

## Protocol for any AI-suggested fix

1. **Ask for evidence, not a fix.** Paste the failing test, the error and a passing run, then use:
   ```text
   List the three most likely root causes, ranked. For each one, quote the log line or code that
   supports it and rate your confidence as low, medium or high. Do not propose a fix yet.
   ```
2. **Pick the cause the evidence supports**, then ask for the fix for that cause only.
3. **Prove it** by running the affected test many times, not once:
   ```bash
   npm run test:repeat -- --grep "TC07"        # 10 runs of one test against the mock
   ```
4. **Read the diff.** Reject fixes that add waits, retries, or weaker assertions to make a test pass.

## Practice: ask for a tool recommendation twice

Ask "Which tool should we use for UI automation of twodos?" with no context, then again with the
context block from [01-lifecycle/prompts.md](../01-lifecycle/prompts.md) (Flutter, iOS / Android / Windows,
no web app, one-person team). Write down what changed and which answer asked about your constraints.
