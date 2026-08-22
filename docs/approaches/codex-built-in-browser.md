# Codex built-in Browser

## What it is

The ChatGPT desktop app provides Codex with a shared, in-app Browser pane for websites and local web apps. It uses a profile separate from the user's regular browser and can be opened from the toolbar or with Cmd+Shift+B / Ctrl+Shift+B. It is not available in Codex CLI or the IDE extension.

## Test

Supported modes: **launch** and **takeover**.

1. Open a Codex task in the ChatGPT desktop app and open Browser.
2. Either open the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=codex-built-in-browser&mode=takeover) in the pane or give Codex the generated launch prompt.
3. Observe the counter and detector after Codex acts.

## Detection

No Codex-specific page-visible marker is currently known. Whether the in-app Browser exposes a generic automation signal is untested. This is a current research gap, not a conclusion that the flow is fundamentally page-unobservable.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: not manually performed.
- ChatGPT desktop, browser engine, and OS versions: not recorded.

Source: [OpenAI — Browser](https://learn.chatgpt.com/docs/browser).
