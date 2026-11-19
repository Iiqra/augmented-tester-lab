# The Augmented Tester · Lab

Hands-on companion to the ebook **The Augmented Tester** by Iqra Naz, about how generative AI
is changing testing, QA and code review. Every concept in the book is practised here on a real,
shipped product: **[twodos](https://twodos.app/)**, a shared to-do app for two people.

The book explains the ideas. This repo shows them running: prompts, AI output, the human review,
and tests that pass.

## What is inside

| Chapter | Folder | Status |
|---|---|---|
| 1 · Gen AI in software testing | [chapters/01-gen-ai-in-software-testing](chapters/01-gen-ai-in-software-testing/) | Ready |
| 2 · Test strategy with Gen AI | [chapters/02-test-strategy](chapters/02-test-strategy/) | Next |
| 3 · Test cases with Gen AI | [chapters/03-test-cases](chapters/03-test-cases/) | Planned |
| 4 · Test automation with Gen AI | [chapters/04-test-automation](chapters/04-test-automation/) | Planned |
| 5 · Non-functional testing with Gen AI | [chapters/05-non-functional-testing](chapters/05-non-functional-testing/) | Planned |

Supporting material:

- [docs/twodos-under-test.md](docs/twodos-under-test.md): what twodos is, what is documented about its API, and what is still unconfirmed.
- [mock/server.mjs](mock/server.mjs): a local mock of the documented API, so every exercise runs offline.
- [src/twodos-client.ts](src/twodos-client.ts): small API helper shared by all tests.

## Quick start

Requires Node.js 20+.

```bash
npm install
npm run test:mock              # Playwright API tests against the local mock
npm run ch1:coverage           # acceptance criteria -> test case coverage
npm run ch1:check-endpoints    # catch hallucinated endpoints
npm run ch1:compare-runs       # compare several AI runs of the same prompt
```

To run against a real environment you own, copy `.env.example` to `.env`, set `TWODOS_BASE_URL`
and a **dedicated test account**, then run `npm test`. Fetch the live spec with `npm run spec:fetch`.

## Ground rules

- AI output is a draft. Raw outputs are kept next to the reviewed versions so the review is visible.
- No real user data in prompts, ever.
- Anything constructed for teaching (sample runs, example clients) is labelled as such in the file.
