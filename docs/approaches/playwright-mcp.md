# Playwright MCP

## What it is

Microsoft's Playwright MCP server lets any compatible agent host open a browser, navigate, read accessibility snapshots, and interact through Playwright tools. Claude Code and Codex are setup examples; the browser-side detection problem belongs to the MCP server and its browser configuration rather than the selected model.

## Test

Supported mode: **launch**.

1. Configure `@playwright/mcp@latest` in the Claude Code or Codex host you want to test and start a fresh session.
2. Confirm its browser tools are available.
3. Select [Playwright MCP in the lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=playwright-mcp&mode=launch) and give the host its generated prompt.

## Detection

No runtime signal attributes this flow to a particular model or agent host. The lab concludes generic automation only when `navigator.webdriver` is true or a known Playwright global exists.

In the inspected default launch configuration, both aggregate booleans remained `false` and all eight signals present in the lab at test time were `not_detected`. Playwright MCP 0.0.79 used Playwright Core 1.63.0-alpha-2026-08-05 and Chrome 151.0.7922.174. That configuration omits Playwright's default `--enable-automation` argument, adds `--disable-blink-features=AutomationControlled`, and exposes neither known Playwright global. These are version- and configuration-specific observations, not a claim that every Playwright MCP mode is undetectable.

Two additional candidates were rejected from the product detector:

- Testing whether an unsolicited popup opens is active, changes browser state, and can also reflect site permissions or manually supplied browser flags.
- Classifying very short, stationary mouse clicks requires continuous event monitoring and remains a behavioral heuristic.

The tested configuration therefore has no known passive deterministic browser-side signal. Other launch arguments, CDP connections, extension modes, or future versions may expose an existing generic automation signal.

## Live Snapshot
<img width="2674" height="1358" alt="image" src="https://github.com/user-attachments/assets/30091280-3d5e-44bf-b23d-8700a213209e" />

## Inspection

- Official docs and package source inspected: 2026-08-23.
- Product test: Claude Code controlled the lab through Playwright MCP; the Claude Code version was not recorded.
- Versions: `@playwright/mcp` 0.0.79; Playwright Core 1.63.0-alpha-2026-08-05; Chrome 151.0.7922.174.

Sources: [Playwright MCP installation](https://playwright.dev/mcp/installation), [Anthropic MCP configuration](https://code.claude.com/docs/en/mcp), [OpenAI MCP configuration](https://learn.chatgpt.com/docs/extend/mcp), [automation signal notes](../detection/automation-signals.md).
