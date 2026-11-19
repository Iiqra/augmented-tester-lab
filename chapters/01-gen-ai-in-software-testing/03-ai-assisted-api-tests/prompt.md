```text
Role: You are a senior QA automation engineer in this repository.
Context: Playwright Test (TypeScript), API tests only. Use the helper in src/twodos-client.ts
(Twodos class, unwrap, idOf, uniqueLabel). Base URL comes from playwright.config.ts.
twodos returns HTTP 200 with the real status in the body as statusCode / reason.
Task: Automate the test cases in 02-test-cases-from-a-story/reviewed-test-cases.json.
Constraints:
- Only call endpoints that exist in spec/openapi.json. If one is missing, stop and say so.
- One test per case id, named "TCxx <title>". Assert statusCode and reason, not only "no error".
- Each test creates its own list with uniqueLabel() and deletes it afterwards.
- No fixed waits, no retries.
- Cases marked OPEN become test.fixme with the open question as the reason.
Output: one spec file. Do not change the helper.
```
