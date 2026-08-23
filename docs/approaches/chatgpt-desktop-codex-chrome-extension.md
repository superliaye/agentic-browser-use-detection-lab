# ChatGPT Desktop — Codex + Chrome extension

## What it is

This flow is a Codex task in the ChatGPT desktop app using OpenAI's Chrome plugin and extension. It can read or act on permitted sites in the user's signed-in Chrome profile and can open task tab groups.

## Test

Supported modes: **launch** and **takeover**.

1. In the ChatGPT desktop app, install the Chrome plugin and its Chrome extension.
2. Start a new Codex task with the Chrome plugin enabled. For takeover, first open the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=chatgpt-desktop-codex-chrome-extension&mode=takeover) in Google Chrome.
3. Give Codex the generated prompt and approve site access if asked. The prompt makes Codex initialize its Chrome client, verify the tab, and stay in that same tab for the interaction and result.

## Detection

The detector watches this extension-owned overlay root:

```html
<div
  id="codex-agent-overlay-root"
  data-codex-agent-overlay-root="true"
></div>
```

The extension creates the root after linking the page to an agent session. Its presence sets `isAgenticUseDetected` through the `codex-extension-agent-overlay-root` signal. The root can remain after control stops, so it proves that Codex extension control occurred in this page document, not that Codex is acting at the current moment.

The signal is `detected_now` while the root is present and `detected_earlier_in_session` if it disappears after being observed. The aggregate agentic-use boolean stays `true` for the detector session. The marker is an implementation artifact, not a supported OpenAI detection API, and its absence means only “not detected.”

The verified run set `isAgenticUseDetected` to `true` and reported `codex-extension-agent-overlay-root` as `detected_now`. `navigator.webdriver` and the known Playwright globals remained undetected, so `isGenericAutomationDetected` stayed `false`. The lab does not treat extension installation as agentic use and does not probe the extension's web-accessible cursor asset.

## Live snapshot
<img width="1693" height="1212" alt="image" src="https://github.com/user-attachments/assets/ec6fb3a6-da36-4c2a-8e0c-e7ee1f18cf4b" />

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: Codex claimed a Chrome tab, incremented the lab counter, and triggered the overlay-root detection on 2026-08-23.
- Chrome extension version: 1.2.27268.51612.
- Codex app, Chrome, and OS versions: not recorded.

Sources: [OpenAI — Chrome extension](https://learn.chatgpt.com/docs/chrome-extension), [ChatGPT in the Chrome Web Store](https://chromewebstore.google.com/detail/chatgpt/hehggadaopoacecdllhhajmbjkdcmajg), [OpenAI Codex issue #24040](https://github.com/openai/codex/issues/24040).
