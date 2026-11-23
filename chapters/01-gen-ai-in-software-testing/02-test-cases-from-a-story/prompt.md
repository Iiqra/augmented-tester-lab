# Prompt: generate test cases from the story

```text
Role: You are a senior QA engineer testing the twodos iOS app (a shared to-do list for two people).
Context: <paste user-story.md, including the acceptance criteria table and open questions>
Task: Write functional UI test cases for this story, positive and negative.
Output: JSON array. Each item: { "id", "title", "covers": ["AC1", ...],
  "preconditions", "steps": [], "data", "expected" }.
Rules: Do not invent screens, buttons or business rules that are not in the context.
Mark anything you inferred with "ASSUMPTION:". Use the AC ids exactly as given.
```

Save each raw run as `ai-runs/run-N.json`, review and merge into `reviewed-test-cases.json`,
then run `npm run ch1:coverage`.
