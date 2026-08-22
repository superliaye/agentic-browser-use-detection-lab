# Claude Code + Playwright MCP

## What it is

Claude Code uses Microsoft's Playwright MCP server to open a headed browser, navigate, read accessibility snapshots, and interact through Playwright tools.

## Test

Supported mode: **launch**.

1. Configure `@playwright/mcp@latest` as an MCP server in Claude Code and start a fresh session.
2. Confirm its browser tools are available.
3. Select this approach in the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=claude-code-playwright-mcp&mode=launch) and give Claude the generated prompt.

## Detection

No runtime signal attributes this flow to Claude. The lab conditionally detects generic automation when `navigator.webdriver` is true or a known Playwright global exists. Those artifacts depend on browser and connection configuration, so their absence is not a verdict.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: not manually performed.
- Playwright MCP and browser versions: not recorded.

Sources: [Playwright MCP installation](https://playwright.dev/mcp/installation), [Anthropic MCP configuration](https://code.claude.com/docs/en/mcp), [automation signal notes](../detection/automation-signals.md).
