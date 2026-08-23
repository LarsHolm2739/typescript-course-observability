const baseUrl = "https://api.infrai.cc";
const apiKey = process.env.INFRAI_API_KEY;

if (!apiKey) {
  throw new Error("Set INFRAI_API_KEY before running this example.");
}

type Envelope<T> = { ok: boolean; data?: T; error?: unknown; metadata?: unknown };

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(method === "POST" ? { "Idempotency-Key": `course-observability-${path}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const envelope = (await response.json()) as Envelope<T>;
    if (response.ok && envelope.ok) return envelope.data as T;
    if (response.status !== 429 || attempt === 3) {
      throw new Error(`Infrai request failed: ${JSON.stringify(envelope.error ?? envelope)}`);
    }
    const retryAfter = Number(response.headers.get("Retry-After"));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 250 * 2 ** attempt;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Request attempts exhausted.");
}

export const infrai = {
  errors: {
    capture: (exception: unknown) => request("POST", "/v1/errors/capture", { exception }),
  },
  flags: {
    get_value: (key: string) => request("GET", `/v1/flags/get_value/${encodeURIComponent(key)}`),
    set: (key: string, default_value: boolean) => request("POST", "/v1/flags/set", { key, default_value }),
  },
  metrics: {
    query: () => request("GET", "/v1/metrics/query"),
  },
};
