```text
Role: You are a senior QA automation engineer working in this repository.
Context: Maestro flows (YAML) for the twodos iOS app, running on an iOS simulator.
Existing patterns: reusable subflows in flows/subflows/ (login, open-test-list, add-task, cleanup);
every UI label is a variable from labels.env (for example ${LABEL_ADD_TASK}).
Task: Using the Maestro MCP tools, open twodos on the booted simulator, look at the real screens,
and automate test case <TCxx> from 02-test-cases-from-a-story/reviewed-test-cases.json.
Constraints:
- Only use labels you saw on screen. If a label is missing, add it to labels.env and say so.
- Reuse the subflows. Each flow cleans up the tasks it creates.
- Assert the expected result from the case, not only that nothing crashed.
- Cases marked OPEN: stop and list the question instead of guessing.
Output: one new flow file, plus any labels.env changes, with a short note of what you observed.
```
