# Codex Chrome extension

## What it is

OpenAI's ChatGPT Chrome extension opens a side chat beside the current tab. A ChatGPT Work or Codex chat can use the Chrome plugin to read or act on permitted sites in the user's signed-in Chrome profile and can open task tab groups.

## Test

Supported modes: **launch** and **takeover**.

1. In the ChatGPT desktop app, install the Chrome plugin and its Chrome extension.
2. For takeover, open the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=codex-chrome-extension&mode=takeover) and the extension panel. For launch, use the generated URL prompt.
3. Start a Codex chat, give it the generated prompt, and approve site access if asked.

## Detection

No product-specific DOM or JavaScript marker is currently known. The lab does not treat extension installation as active use. Generic automation signals may or may not appear; the product flow has not been manually inspected.

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: not manually performed.
- Extension, ChatGPT desktop, Chrome, and OS versions: not recorded.

Source: [OpenAI — Chrome extension](https://learn.chatgpt.com/docs/chrome-extension).
