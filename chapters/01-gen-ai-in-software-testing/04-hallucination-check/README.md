# 04 · Hallucination check: endpoints that do not exist

Book: *When convincing output is wrong*. The book's story is a page object built on DOM attributes
the model invented. The API equivalent is a client that calls **endpoints the spec never defined**.
The code looks clean and plausible until the first request returns `NOT_FOUND`.

`check-endpoints.mjs` extracts every `METHOD /api/...` call from the code and validates it against
the twodos OpenAPI spec (`spec/openapi.json` after `npm run spec:fetch`, otherwise the documented
list in `spec/documented-endpoints.json`).

```bash
npm run ch1:check-endpoints                 # checks src/ and all *.spec.ts files
npm run ch1:check-endpoints -- --examples   # also checks the example below
```

[examples/ai-generated-client.example.ts](examples/ai-generated-client.example.ts) is a **constructed
example** written for this exercise: realistic-looking AI output with three invented endpoints mixed
in with real ones. Run the checker against it, then try the same with a client your own AI tool generates.
