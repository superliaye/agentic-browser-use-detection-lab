# Codex Computer Use

## What it is

The Computer Use plugin in the ChatGPT desktop app lets ChatGPT Work or Codex see and operate approved macOS or Windows apps. A task can invoke Chrome with `@Chrome`; macOS requires Screen Recording and Accessibility permissions.

## Test

Supported modes: **launch** and **takeover**.

1. In ChatGPT desktop, select Codex and install or enable the Computer Use plugin.
2. Approve Chrome. On macOS, grant Screen Recording and Accessibility; on Windows, keep Chrome visible on the active desktop.
3. Open the selected [lab flow](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=codex-computer-use&mode=takeover) and give Codex its generated prompt.

## Detection

No Codex-specific page-visible signal is currently known. Native or accessibility-driven clicks can be indistinguishable from ordinary input to the page. The flow is untested, so a generic automation artifact may still exist in current versions.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: not manually performed.
- ChatGPT desktop, Computer Use, Chrome, and OS versions: not recorded.

Source: [OpenAI — Computer Use](https://learn.chatgpt.com/docs/computer-use).
