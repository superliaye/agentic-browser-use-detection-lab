import {
  getModeInstructions,
  type AgenticApproach,
  type EntryMode,
} from "./approaches.js";

export function buildLaunchUrl(baseUrl: string, approachId: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("approach", approachId);
  url.searchParams.set("mode", "launch");
  return url.toString();
}

export function buildTestPrompt(
  approach: AgenticApproach,
  mode: EntryMode,
  launchUrl: string | undefined = undefined,
): string {
  getModeInstructions(approach, mode);

  if (mode === "launch") {
    if (launchUrl === undefined) {
      throw new Error(`A launch URL is required for ${approach.name}`);
    }

    return `Open ${launchUrl} in the browser you control. On that page, click the button labeled "Increment counter" exactly once using the normal browser-control tools for this approach. After the count changes, report the two detection booleans and any signals shown as detected.`;
  }

  return `On the current page, click the button labeled "Increment counter" exactly once using the normal browser-control tools for this approach. After the count changes, report the two detection booleans and any signals shown as detected.`;
}
