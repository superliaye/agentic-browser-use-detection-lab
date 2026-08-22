# Claude Code Computer Use

## What it is

Claude Code CLI exposes a built-in `computer-use` MCP server in research preview on macOS for Pro and Max plans. It can see the screen and operate approved apps after Accessibility and Screen Recording permission is granted.

## Test

Supported browser-operation modes: **none**.

Current Anthropic documentation classifies browsers and trading platforms as **view-only** for Claude Code Computer Use. The flow can inspect Chrome but cannot click the lab counter, so the lab intentionally provides no runnable prompt.

To inspect the product limitation itself, run `/mcp` in an interactive Claude Code session, enable `computer-use`, approve Chrome for the session, and review the app-permission tier shown by Claude Code.

## Detection

No testable browser interaction occurs under the documented permission tier. If Anthropic later enables browser input, native computer control may leave no deterministic page-visible attribution signal; that would require a new inspection.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: not manually performed.
- Documented availability: macOS research preview, Pro or Max, interactive CLI only; not Team or Enterprise.

Source: [Anthropic — Let Claude use your computer from the CLI](https://code.claude.com/docs/en/computer-use).
