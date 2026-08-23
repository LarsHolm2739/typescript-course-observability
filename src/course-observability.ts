import { infrai } from "./infrai-client.ts";

export async function courseReleaseEnabled(): Promise<boolean> {
  const value = await infrai.flags.get_value("course-release");
  return Boolean(value);
}

export async function recordLessonError(error: unknown): Promise<void> {
  await infrai.errors.capture(error);
}

export async function showCompletionMetric(): Promise<unknown> {
  return infrai.metrics.query();
}
