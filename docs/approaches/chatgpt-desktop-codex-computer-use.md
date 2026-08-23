# ChatGPT Desktop — Codex Computer Use

## What it is

This flow is a Codex task using the Computer Use plugin in the ChatGPT desktop app to see and operate approved macOS or Windows apps. A task can invoke Chrome with `@Chrome`; macOS requires Screen Recording and Accessibility permissions.

## Test

Supported modes: **launch** and **takeover**.

1. In ChatGPT desktop, select Codex and install or enable the Computer Use plugin.
2. Approve Chrome. On macOS, grant Screen Recording and Accessibility; on Windows, keep Chrome visible on the active desktop.
3. Open the selected [lab flow](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=chatgpt-desktop-codex-computer-use&mode=takeover) and give Codex its generated prompt.

## Detection

In the inspected launch run, Codex Computer Use alone opened the lab and clicked the counter exactly once. The count changed from 0 to 1 while `isAgenticUseDetected` and `isGenericAutomationDetected` both remained `false`; every listed signal was `not_detected`.

No Codex-specific page-visible signal was observed. Native or accessibility-driven clicks can be indistinguishable from ordinary input to the page. Takeover uses the same Computer Use controller and is expected to produce the same detection result, but it was not separately inspected. The observed result applies only to the tested launch configuration and does not prove that other versions or configurations leave no detectable artifact.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: Codex Computer Use completed the launch flow on 2026-08-23; both aggregate booleans remained `false` and no signal was detected.
- ChatGPT desktop, Computer Use, Chrome, and OS versions: not recorded.

Source: [OpenAI — Computer Use](https://learn.chatgpt.com/docs/computer-use).
