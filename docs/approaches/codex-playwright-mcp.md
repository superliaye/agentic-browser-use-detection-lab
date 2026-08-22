# Codex + Playwright MCP

## What it is

Codex in the ChatGPT desktop app, CLI, or IDE extension uses Microsoft's Playwright MCP server to launch and control a browser. Those Codex hosts share MCP configuration.

## Test

Supported mode: **launch**.

1. Add Playwright MCP with `codex mcp add playwright -- npx @playwright/mcp@latest` and restart the Codex host.
2. Confirm the Playwright tools are available.
3. Select this approach in the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=codex-playwright-mcp&mode=launch) and give Codex the generated prompt.

## Detection

No runtime signal attributes the flow to Codex. The detector conditionally concludes generic automation from `navigator.webdriver` or Playwright globals. Those signals are configuration-dependent and may be absent when connecting to an existing or modified browser.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: not manually performed.
- Codex, Playwright MCP, and browser versions: not recorded.

Sources: [OpenAI MCP configuration](https://learn.chatgpt.com/docs/extend/mcp), [Playwright MCP installation](https://playwright.dev/mcp/installation), [automation signal notes](../detection/automation-signals.md).
