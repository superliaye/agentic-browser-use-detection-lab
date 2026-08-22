# Claude Code + Chrome DevTools MCP

## What it is

Claude Code uses Google's Chrome DevTools MCP server, which uses Puppeteer to inspect and automate a launched Chrome or connect to an existing remote-debugging instance.

## Test

Supported modes: **launch** and **takeover**.

1. Add the server with `claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest`.
2. For launch, use its default browser mode. For takeover, start a separate Chrome with remote debugging and configure the server's browser URL.
3. Start a fresh Claude Code session and give it the prompt from the selected [lab flow](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=claude-code-chrome-devtools-mcp&mode=launch).

## Detection

No signal attributes this flow to Claude. A server-launched browser may expose `navigator.webdriver`, which concludes generic automation. A connection to an existing Chrome may expose none of the current probes. CDP alone is not detected; the obsolete `Error.stack` getter is deliberately excluded.

## Inspection

- Official repository and docs inspected: 2026-08-22.
- Product test: not manually performed.
- Server, Chrome, and Claude Code versions: not recorded.

Sources: [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), [Chrome setup guide](https://developer.chrome.com/docs/devtools/agents/get-started), [CDP limitation](../detection/browser-observability-limits.md).
