# 01 · Generative AI across the lifecycle, applied to twodos

Book: *Where AI fits in the lifecycle*. Each stage below has a prompt with **real twodos context**, so the model has less to assume.
Run them in any LLM tool, save the answers next to this file as `stage-N-output.md`, and write what you kept and what you rejected in `notes.md`.

Shared context block (paste above every prompt):

```text
Product: twodos, a shared to-do app for exactly two people per list.
Platforms: iOS/iPadOS/macOS, Android, Windows (Flutter). No web app yet.
Backend: REST API with an OpenAPI spec, Socket.IO for real-time list events.
Key features: lists, tasks, groups, one partner per list (invite by email or @username),
alarms (just you / partner / both), location triggers, presence and typing indicators.
Free limits: 50 lists, 200 tasks per list, 5 signed-in devices.
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
Book example: AI agents run test cases by controlling the browser. twodos has no web app,
so this stage is practised through the API in [03-ai-assisted-api-tests](../03-ai-assisted-api-tests/).

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
