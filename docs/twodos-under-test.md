# twodos: the system under test

[twodos](https://twodos.app/) is a shared to-do app for exactly two people: "One list. Two of you."
It is the practice target for every exercise in this repo.

## Current status

- **Live today:** the iOS and Android apps (Flutter).
- **Not live yet:** a web app and a public API.
- Chapter 1 runs on the **iOS simulator** first. Android follows.

## Features worth testing

| Area | What the product does |
|---|---|
| Lists | Name, colour, priority (urgent / non-urgent), deadline, icon, favourite, archive |
| Tasks | Add, edit title, mark done, deadline, delete, reorder, "Clear all completed" |
| Groups | Named sections inside a list ("Produce", "Dairy", ...) |
| Sharing | One partner per list, invite by email or username, accept or decline |
| Reminders | Alarms for "Just you", "Just your partner" or "Both"; repeats; arrive / leave location triggers |
| Real-time | Presence dot and typing indicators |
| Free plan | 50 lists, 200 tasks per list |

## Safe practice rules

1. Use a **dedicated test account**, never a personal one. Never put real user data in prompts.
2. Flows only touch a list called `Lab list` and tasks starting with `Lab:`, and clean up after themselves.
3. Anything constructed for teaching (sample runs, example flows) is labelled as such in the file.

## Making the app easier to test

Maestro finds Flutter elements by visible text or accessibility labels. Buttons that show only an icon
(the add button, the done checkbox) need a label, for example `Semantics(identifier: 'add_task', ...)`
(Flutter 3.19+) or `Icon(Icons.add, semanticLabel: 'Add task')`. A few labels make the flows far more stable.
