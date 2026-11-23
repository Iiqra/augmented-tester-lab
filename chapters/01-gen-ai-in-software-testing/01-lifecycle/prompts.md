# 01 · Generative AI across the lifecycle, applied to twodos

Book: *Where AI fits in the lifecycle*. Each stage below has a prompt with **real twodos context**, so the model has less to assume.
Run them in any LLM tool, save the answers next to this file as `stage-N-output.md`, and write what you kept and what you rejected in `notes.md`.

Shared context block (paste above every prompt):

```text
Product: twodos, a shared to-do app for exactly two people per list.
Platforms today: iOS and Android apps (Flutter). No web app and no public API yet.
Key features: lists, tasks, groups, one partner per list (invite by email or @username),
alarms (just you / partner / both), location triggers, presence and typing indicators,
"Clear all completed".
Free plan limits: 50 lists, 200 tasks per list.
Team: one developer who is also the QA engineer.
```

## Stage 1 · Planning: test strategy
```text
Draft a high-level test strategy for twodos using the context above.
Keep it at strategy level: test levels and their purpose, risks, environments,
who owns what, where automation fits. Do not write test cases or a test plan.
List every assumption you made separately.
```

## Stage 2 · Requirements: review a story
```text
Review this user story for ambiguities, edge cases, missing requirements and
anything that cannot be tested as written. Quote the exact sentence for each finding.
Story: "As a list member, I can invite a partner by email or username so we can share the list."
```

## Stage 3 · During development: cases, exploratory paths, data
```text
For the story in 02-test-cases-from-a-story/user-story.md, write exploratory testing
charters (goal, area, risks to look for) and the test data I need to prepare.
```

## Stage 4 · Implementation complete: run and report
Book example: AI agents run test cases by controlling the browser. For twodos the agent drives the
iOS simulator through Maestro instead. See [03-ai-assisted-ui-flows](../03-ai-assisted-ui-flows/).

## Stage 5 · Release: regression candidates
```text
Here is the changelog for the next twodos release and our list of regression tests.
Rank the tests by relevance to the changes and explain each choice. <paste both>
```

## Stage 6 · Learning: failures and feedback
```text
Group these store reviews and bug reports by feature and likely cause.
Which areas have no automated tests today? <paste reviews, bugs, test list>
```
