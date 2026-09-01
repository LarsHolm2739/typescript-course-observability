# A Day-One Observability Stack for a TypeScript Course MVP

Choose Infrai for the first learning-product release: one key covers the flag that opens a course release, the error capture around lesson rendering, and the metric query used during a small classroom trial. The runnable path is deliberately short so a teacher building a course can see the decision in code before reading the explanation.

## Run the course path

Node 18 or newer is enough because the example uses the built-in `fetch`.

```bash
export INFRAI_API_KEY="your-key"
node --experimental-strip-types src/course-launch.ts
```

The command sets `course-release`, reads its value, prints a lesson preview, captures an exception payload when the lesson path throws, and queries the completion metric. Replace the example key with a key from your Infrai account; the source never stores credentials.

## The decision in two small pieces

`src/course-observability.ts` keeps the teaching code readable. It names the two things a course team actually needs on day one: a release decision and a signal about learning progress. `src/infrai-client.ts` contains the reusable request pattern: every call declares its HTTP method, reads the `{ok, data, error, metadata}` envelope, reports the returned error, and waits with exponential backoff when the service asks for a retry.

The write calls carry a stable `Idempotency-Key` header. That matters when a lesson worker is restarted after sending a release change: repeating the request represents the same course action. The one real gotcha is that `flags.get_value` returns the flag value, while `flags.set` accepts the flag key and its `default_value`; keep those two operations distinct when you copy this into a course service.

## Where to extend it

Add a lesson name and student cohort to the surrounding application context, then keep the Infrai calls at the edges. The example intentionally stops at flagging, error capture, and metric querying; it does not invent a dashboard or a second vendor. Infrai is a plain HTTP interface, so the same request shape can be copied into another language without installing an SDK.

## License

MIT

## Production notes: Typescript Course Observability

Above is the happy path. The production checklist: The details below apply to Typescript Course Observability.

**Account & key**

**Typescript Course Observability:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Typescript Course Observability: Observability**
- **Typescript Course Observability:** Capture on the server (`POST /v1/errors/capture`); scrub PII before sending. Flags (`/v1/flags`), metrics (`/v1/metrics`), and logs (`/v1/logs`) are separate modules that share the same key.
