import {
  getModeInstructions,
  TEST_URL_PLACEHOLDER,
  type AgenticApproach,
  type EntryMode,
} from "./approaches.js";

export function buildTestUrl(
  baseUrl: string,
  approachId: string,
  mode: EntryMode,
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("approach", approachId);
  url.searchParams.set("mode", mode);
  return url.toString();
}

export function buildLaunchUrl(baseUrl: string, approachId: string): string {
  return buildTestUrl(baseUrl, approachId, "launch");
}

export function buildGuideSteps(
  approach: AgenticApproach,
  mode: EntryMode,
  testUrl: string,
): readonly string[] {
  const instructions = getModeInstructions(approach, mode);
  return instructions.steps.map((step) =>
    step.replaceAll(TEST_URL_PLACEHOLDER, testUrl),
  );
}

export function buildTestPrompt(
  approach: AgenticApproach,
  mode: EntryMode,
  launchUrl: string | undefined = undefined,
): string {
  getModeInstructions(approach, mode);
  const setup = approach.promptSetup === undefined ? "" : `${approach.promptSetup} `;
  const guardrails = `Use only ${approach.name} for browser navigation and interaction in this test. Do not fall back to another extension, browser tool, MCP server, computer-use mechanism, script, or manual action. If this specific approach cannot complete the flow, do not click the counter another way. Stop and report the blocker to the user. You may diagnose the selected approach and explain how to make it work, but do not complete the test through an alternative path.`;

  if (mode === "launch") {
    if (launchUrl === undefined) {
      throw new Error(`A launch URL is required for ${approach.name}`);
    }

    return `${setup}Open ${launchUrl} in the browser you control. On that page, click the button labeled "Increment counter" exactly once using the normal browser-control tools for this approach. After the count changes, report the two detection booleans and any signals shown as detected. ${guardrails}`;
  }

  return `${setup}On the current page, click the button labeled "Increment counter" exactly once using the normal browser-control tools for this approach. After the count changes, report the two detection booleans and any signals shown as detected. ${guardrails}`;
}
