# User story: add and complete tasks in a shared list

**As** a twodos list member
**I want** to add tasks to a list and mark them done
**so that** my partner and I can see what is left to do.

## Acceptance criteria

| ID | Criterion | Source |
|---|---|---|
| AC1 | A task with a valid title can be added to a list I belong to | OpenAPI `POST /api/todos/{todoId}` |
| AC2 | A task without a title is rejected (`MISSING_FIELD`) | OpenAPI error examples |
| AC3 | A title longer than the maximum is rejected (`VALIDATION_ERROR`) | OpenAPI schema + example (see open question) |
| AC4 | A description is optional and at most 1000 characters | OpenAPI schema |
| AC5 | A task can be marked done and marked not done again | OpenAPI `PATCH .../done` |
| AC6 | "Clear all completed" removes done tasks and keeps open ones | OpenAPI `PUT /api/todos/clear-done/{todoId}` |
| AC7 | A list cannot exceed the tasks-per-list limit (`ITEM_LIMIT_REACHED`) | OpenAPI + client-config `limits.itemsPerList` |
| AC8 | Requests without a valid token are rejected (`UNAUTHORIZED`) | OpenAPI security scheme |

## Open question found during requirement review

The spec's task schema says `title` max **255**, but its own validation example says
"must be **250** characters or fewer". Which one does production enforce?
Titles of 251 to 255 characters are the gap. This is exactly the kind of ambiguity
an AI review (exercise 01, stage 2) should flag and a human must resolve with the owner.
