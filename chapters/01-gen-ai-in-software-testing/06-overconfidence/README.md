# 06 · Overconfidence: prove the fix before you accept it

Book: *Overconfidence* and *Lack of real reasoning*. A model answers "I found the issue, here is the fix"
with no sign of doubt, even when the root cause has not been found. It also recommends tools without
asking about your team, stack or resources.

## Protocol for any AI-suggested fix to a flow

1. **Ask for evidence, not a fix.** Paste the failing flow, the Maestro output and the screenshot from `reports/`, then:
   ```text
   List the three most likely root causes, ranked. For each one, point to the line in the output
   or the element on the screenshot that supports it, and rate your confidence as low, medium or high.
   Do not propose a fix yet.
   ```
2. **Pick the cause the evidence supports**, then ask for the fix for that cause only.
3. **Prove it** with repeated runs, not one:
   ```bash
   npm run flows:repeat -- chapters/01-gen-ai-in-software-testing/03-ai-assisted-ui-flows/flows/tc04-clear-completed.yaml
   ```
   The runner reports `N/10 runs passed`. Accept the fix only at 10/10.
4. **Read the diff.** Reject fixes that add long waits, make assertions optional or delete a check.

## Practice: ask for a tool recommendation twice

Ask "Which tool should we use for UI automation of twodos?" with no context, then again with the context
block from [01-lifecycle/prompts.md](../01-lifecycle/prompts.md). Note which answer asked about your constraints.
