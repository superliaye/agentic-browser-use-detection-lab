# Codex + Chrome DevTools MCP

## What it is

Codex uses Google's Chrome DevTools MCP server to inspect and control a server-launched Chrome or an existing Chrome exposed through remote debugging.

## Test

Supported modes: **launch** and **takeover**.

1. Add the server with `codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest` and restart the Codex host.
2. For launch, use the default browser mode. For takeover, start a separate Chrome with remote debugging and configure the server to connect to it.
3. Give Codex the prompt from the selected [lab flow](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=codex-chrome-devtools-mcp&mode=launch).

## Detection

No runtime signal attributes this flow to Codex. A launched browser may expose `navigator.webdriver`, but an existing Chrome controlled through CDP may expose none of the current signals. The retired CDP `Error.stack` getter is not used.

## Inspection

- Official repository and docs inspected: 2026-08-22.
- Product test: not manually performed.
- Codex, server, Chrome, and OS versions: not recorded.

Sources: [OpenAI MCP configuration](https://learn.chatgpt.com/docs/extend/mcp), [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), [CDP limitation](../detection/browser-observability-limits.md).
