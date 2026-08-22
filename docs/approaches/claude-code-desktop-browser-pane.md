# Claude Code Desktop Browser pane

## What it is

The **Code tab** in Claude Desktop has an in-app, tabbed Browser pane. It can preview local apps or open external sites in a clean profile, and Claude can inspect the DOM, click, and fill forms. This is not a general Browser pane in every Claude Desktop chat.

## Test

Supported modes: **launch** and **takeover**.

1. Open a Code session in Claude Desktop.
2. Open Browser with Cmd+Shift+B on macOS or Ctrl+Shift+B on Windows.
3. Open the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=claude-code-desktop-browser-pane&mode=takeover) in that pane or give Claude the generated launch prompt.
4. Approve the external site's actions if asked.

## Detection

No product-specific page-visible signal is currently known. The existing Claude extension markers are not assumed to apply to the in-app Browser. Generic automation probes may fire in a future product test, but that is unverified.

This is an exhausted-current-options conclusion, not proof that the flow is fundamentally undetectable.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: not manually performed.
- Desktop, Chromium, and OS versions: not recorded.

Source: [Anthropic — Claude Code Desktop](https://code.claude.com/docs/en/desktop#preview-your-app) and [Browse external sites](https://code.claude.com/docs/en/desktop#browse-external-sites).
