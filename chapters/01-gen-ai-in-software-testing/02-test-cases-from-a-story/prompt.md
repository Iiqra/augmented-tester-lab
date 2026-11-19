# Prompt: generate test cases from the story

Role, context and expected result, as described in the book.

```text
Role: You are a senior QA engineer testing the twodos REST API.
Context: <paste user-story.md, including the acceptance criteria table>
Task: Write functional test cases for this story, positive and negative.
Output: JSON array. Each item: { "id", "title", "covers": ["AC1", ...],
  "preconditions", "steps": [], "data", "expected" }.
Rules: Do not invent fields, endpoints or business rules that are not in the context.
Mark anything you inferred with "ASSUMPTION:". Use the AC ids exactly as given.
```

Save each run as `ai-runs/run-N.json`. Then:
1. Run the prompt 3 times (see exercise 05 for comparing runs).
2. Review, merge and de-duplicate into `reviewed-test-cases.json`.
3. `npm run ch1:coverage` to confirm every AC is covered.
