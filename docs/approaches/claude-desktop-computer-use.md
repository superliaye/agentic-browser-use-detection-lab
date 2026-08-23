# Claude Desktop — Computer Use

## What it is

The Code tab in Claude Desktop exposes a built-in `computer-use` MCP server. After the required operating-system permissions and per-session app approval, Claude can inspect or control approved desktop apps according to fixed permission tiers.

## Test

Supported browser-operation modes: **none**.

Anthropic classifies browsers and trading platforms as **view-only** for Claude Desktop Computer Use. The flow can inspect a browser but cannot click or type in it, so it cannot operate the lab counter and the lab intentionally provides no runnable prompt.

To inspect the product limitation itself, open a Code session in Claude Desktop, run `/mcp`, enable `computer-use`, approve a browser for the session, and review the view-only permission tier shown by Claude.

## Detection

No testable browser interaction occurs under the view-only permission tier. If Anthropic later enables browser input, native computer control may leave no deterministic page-visible attribution signal; that would require a new inspection.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: browser inspection succeeded, while click and typing remained unavailable, on 2026-08-22.
- Claude Desktop app: 1.34493.1 (255293).
- Documented availability: Claude Desktop on macOS and Windows; computer use requires a supported plan and operating-system permissions.

Sources: [Anthropic — Computer use](https://code.claude.com/docs/en/computer-use) and [Claude Code Desktop](https://code.claude.com/docs/en/desktop).
