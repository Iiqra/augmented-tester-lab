# User story: add and complete tasks in a shared list

**As** a twodos list member
**I want** to add tasks to a list and mark them done
**so that** my partner and I can see what is left to do.

Platform for chapter 1: the twodos **iOS app** (iPhone simulator).

## Acceptance criteria

| ID | Criterion | Source |
|---|---|---|
| AC1 | A task with a title can be added to a list I belong to and appears in the list | Product behaviour |
| AC2 | An empty task cannot be added | Product behaviour (see open questions) |
| AC3 | A task can be marked done and marked not done again | Product behaviour |
| AC4 | "Clear all completed" removes done tasks and keeps open ones | twodos.app feature list |
| AC5 | A task title can be edited | twodos.app feature list |
| AC6 | A task can be deleted | twodos.app feature list |
| AC7 | A list holds at most 200 tasks on the free plan | twodos.app FAQ |
| AC8 | A new task is still there after the app is closed and reopened | Product behaviour |

## Open questions (requirement review)

1. AC2: is the save button disabled for an empty title, or is a message shown? The automated flow assumes a disabled button until confirmed.
2. AC7: what does the user see when adding task 201?
3. Is there a maximum title length in the app?

Questions like these are exactly what the requirement-review prompt in exercise 01 should surface, and what a person has to resolve with the product owner.
