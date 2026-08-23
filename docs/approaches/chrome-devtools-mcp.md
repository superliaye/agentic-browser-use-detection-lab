# Chrome DevTools MCP

## What it is

Google's Chrome DevTools MCP server lets any compatible agent host inspect and automate a launched Chrome or connect to an existing remote-debugging instance. Claude Code and Codex are setup examples; the browser-side detection problem belongs to the server and connection mode rather than the selected model.

## Test

Supported modes: **launch** and **takeover**.

1. Configure `chrome-devtools-mcp@latest` in the Claude Code or Codex host you want to test.
2. For launch, use its default browser mode. For takeover, start a separate Chrome with remote debugging and configure the server's browser URL.
3. Start a fresh session and give the host the prompt from the selected [lab flow](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=chrome-devtools-mcp&mode=launch).

## Detection

No signal attributes this flow to a particular model or agent host. A server-launched browser may expose `navigator.webdriver`, which concludes generic automation. A connection to an existing Chrome may expose none of the current probes. CDP alone is not detected; the obsolete `Error.stack` getter is deliberately excluded.

## Live Snapshot
<img width="2645" height="1295" alt="image" src="https://github.com/user-attachments/assets/36e76f44-35a3-4a38-97e2-a8512a12683e" />

## Inspection

- Official repository and docs inspected: 2026-08-22.
- Product test: not manually performed.
- Server, Chrome, and agent-host versions: not recorded.

Sources: [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), [Chrome setup guide](https://developer.chrome.com/docs/devtools/agents/get-started), [Anthropic MCP configuration](https://code.claude.com/docs/en/mcp), [OpenAI MCP configuration](https://learn.chatgpt.com/docs/extend/mcp), [CDP limitation](../detection/browser-observability-limits.md).
