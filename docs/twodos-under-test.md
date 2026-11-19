# twodos: the system under test

[twodos](https://twodos.app/) is a shared to-do app for exactly two people: "One list. Two of you."
It is the practice target for every exercise in this repo.

## Why twodos

- It is a real, released product (v1.68.0 at the time of writing), not a toy demo.
- It ships on several platforms: iPhone/iPad and Mac (App Store), Android (Google Play) and Windows (Microsoft Store). Flutter clients.
- It publishes an OpenAPI spec (`/openapi.json`), a health endpoint (`/health`) and a Socket.IO events doc (`/docs/sockets.md`).
- There is **no web app yet**, so browser-driven exercises from the book are adapted to the **REST API** (and, in later chapters, to the mobile/desktop builds).

## Features worth testing

| Area | What the product does |
|---|---|
| Lists | Label, colour, priority (urgent / non-urgent), deadline, icon, favourite, archive, soft delete and restore |
| Tasks | Add, rename, complete / uncomplete, deadline, description, delete, reorder, "Clear all completed" |
| Groups | Named sections inside a list ("Produce", "Dairy", ...) |
| Sharing | One partner per list, invite by email or `@username`, accept / decline, block and report |
| Reminders | Alarms for "Just you", "Just your partner" or "Both"; daily / weekly / monthly repeats; arrive / leave location triggers |
| Real-time | Presence dot, typing indicators, `LIST::*` socket events to the other member |
| Auth | Email + password, 6-digit email code, Google / Facebook / Apple, device list and revoke |
| Limits (free) | 50 lists, 200 tasks per list, 20 groups per list, 30 alarms, 5 signed-in devices |

## API facts used by the exercises

| Fact | Status |
|---|---|
| Most responses are HTTP 200 with the real status in the body: `{ statusCode, data }` or `{ statusCode, reason, statusMessage }` | Documented |
| Rate-limited calls return HTTP 200 with `statusCode: 429`, `reason: TOO_MANY_REQUESTS` | Documented |
| `POST /api/todos` and `POST /api/todos/{todoId}` return `data: true` and **no id** | Documented |
| Task `title` is required; `description` max 1000 | Documented |
| Task `title` max length: schema says **255**, the spec's own example error says **250** | **Inconsistent in the docs** (see chapter 1, exercise 02) |
| Production REST base URL (`https://twodos.app` vs `https://api.twodos.app`) | **Not stated** in the spec (server is `http://localhost:1234`). Set `TWODOS_BASE_URL` yourself |
| Login token location (`token` vs `data.token`) | **Inconsistent** between schema and sockets doc; the client helper accepts both |

## Safe practice rules

1. Use a **dedicated test account**, never a personal one. Never put real user data in prompts.
2. Run against the **local mock** first (`npm run test:mock`). Point at a real environment only when you own it.
3. Respect rate limits from `GET /api/v1/client-config`. Tests run sequentially with no retries.
4. Every test cleans up the lists it creates.
