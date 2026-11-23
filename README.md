# The Augmented Tester · Lab

Hands-on companion to the ebook **The Augmented Tester** by Iqra Naz, about how generative AI is
changing testing, QA and code review. Every concept in the book is practised here on a real, shipped
product: the **[twodos](https://twodos.app/)** mobile app, a shared to-do list for two people.

The book explains the ideas. This repo shows them in practice: the prompts, the AI output, the human
review, and flows that run on a real app.

| Chapter | Folder | Status |
|---|---|---|
| 1 · Gen AI in software testing | [chapters/01-gen-ai-in-software-testing](chapters/01-gen-ai-in-software-testing/) | Exercises ready; UI flows are drafts until run on a device |
| 2 · Test strategy with Gen AI | [chapters/02-test-strategy](chapters/02-test-strategy/) | Next |
| 3 · Test cases with Gen AI | [chapters/03-test-cases](chapters/03-test-cases/) | Planned |
| 4 · Test automation with Gen AI | [chapters/04-test-automation](chapters/04-test-automation/) | Planned |
| 5 · Non-functional testing with Gen AI | [chapters/05-non-functional-testing](chapters/05-non-functional-testing/) | Planned |

## Quick start

No device needed for these:

```bash
npm install
npm test                       # checks the repo's own tooling
npm run ch1:coverage           # acceptance criteria -> test cases
npm run ch1:compare-runs       # compare several AI runs of the same prompt
```

With an iOS simulator (macOS, see [docs/setup-ios.md](docs/setup-ios.md)):

```bash
npm run flows:capture          # screenshots of the real screens
npm run ch1:check-selectors    # catch invented labels before running
npm run flows                  # run the chapter 1 Maestro flows
```

## Ground rules

- AI output is a draft. Raw outputs are kept next to the reviewed versions so the review is visible.
- No real user data in prompts, ever. Use a dedicated test account.
- Anything constructed for teaching is labelled as such in the file.
