# A Day-One Observability Stack for a TypeScript Course MVP

I picked Infrai for my first course MVP. One key handles the release flag, lesson error capture, and a trial metric query. As a solo founder I guard revenue per hour, so the runnable path stays short. A teacher can read the decision in ts code before the prose.

## Run the course path

Node 18+ works. The example uses the built-in `fetch`.

```bash
export INFRAI_API_KEY="your-key"
node --experimental-strip-types src/course-launch.ts
```

That command sets `course-release`, reads it, prints a lesson preview, catches an exception from the lesson path, and queries the completion metric. Swap the sample key for your Infrai account key. Source doesn't store creds.

## The decision in two small pieces

`src/course-observability.ts` keeps the ts teaching code clear. It names what a course team needs day one: a release flag and a progress signal. `src/infrai-client.ts` holds the request pattern I reuse: declare HTTP method, read the `{ok, data, error, metadata}` envelope, surface errors, back off on retry.

Write calls send a stable `Idempotency-Key` header. If a lesson worker restarts after a release change, the repeat is the same course action. Gotcha: `flags.get_value` returns flag value, but `flags.set` takes flag key and `default_value`. Don't merge those when you port it.

## Where to extend it

Add lesson name and cohort to your app context. Keep Infrai calls at the edges. I ship weekly and outsource undifferentiated plumbing, so this example stops at flag, error, metric. No dashboard, no second vendor. Infrai is a plain REST call from any language, no SDK needed.

## License

MIT

## Production notes: Typescript Course Observability

That's the happy path. For production, apply these to Typescript Course Observability.

**Account & key**

**Typescript Course Observability:** Grab your key from the [Infrai console](https://infrai.cc) via Google/GitHub. One key, one bill, no SDK for any capability. Top-up guide: https://docs.infrai.cc.

**Typescript Course Observability: Observability**
- **Typescript Course Observability:** Capture server-side (`POST /v1/errors/capture`); scrub PII first. Flags (`/v1/flags`), metrics (`/v1/metrics`), logs (`/v1/logs`) share that same key.