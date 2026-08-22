# Codex built-in Browser marker

The Codex built-in Browser injects this root into the page DOM:

```html
<div id="codex-browser-sidebar-comments-root"></div>
```

The `codex-built-in-browser-context` probe concludes `agentic_use` when the element is present. This means the page is loaded or viewed through Codex's agentic browser context; it does not attribute a particular interaction to Codex.

Its signal status is `detected_now` while the marker is present and `detected_earlier_in_session` if the marker disappears after this detector instance observed it. These labels describe the marker, not whether Codex is actively interacting with the page. The aggregate `isAgenticUseDetected` boolean remains latched.

The marker was observed on 2026-08-22 in Codex 26.818.41509 after Codex opened the lab and incremented its counter. The same inspection reported `navigator.webdriver === false` and no known Playwright globals, so no generic automation signal was detected.

This is a product implementation artifact, not a supported OpenAI detection API. It may change between versions, and its absence means only “not detected.”

Sources:

- [OpenAI — Browser](https://learn.chatgpt.com/docs/browser)
- [Third-party restored Codex preload — root mounting](https://github.com/JimLiu/decode-codex/blob/6fd43d66ccad32c9c1ab83b9704e0bbbbf2d4c7b/restored/main/preload/browser-sidebar-comment-runtime/mount.ts#L132-L145), inspected 2026-08-22
