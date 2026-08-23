import { courseReleaseEnabled, recordLessonError, showCompletionMetric } from "./course-observability.ts";
import { infrai } from "./infrai-client.ts";

async function main(): Promise<void> {
  const enabled = await courseReleaseEnabled();
  console.log(`course-release: ${enabled ? "enabled" : "disabled"}`);
  try {
    if (!enabled) throw new Error("The lesson is waiting for release.");
    console.log("lesson preview: fractions-01");
  } catch (error) {
    await recordLessonError(error);
    console.log("lesson error captured");
  }
  console.log("completion metric:", await showCompletionMetric());
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
