# Agentic Browser Use Detection Lab

A application-agnostic lab for testing what a web page can deterministically observe when Claude or Codex operates a Chromium browser.

**[Open the live lab](https://superliaye.github.io/agentic-browser-use-detection-lab/)**

See [detection mechanisms](docs/detection/) and [browser observability limits](docs/detection/browser-observability-limits.md).

## Approach catalog

Select an approach name to open its test instructions, observed signals, versions, and detection limits.

| Approach — open details | Agentic detection | Notes |
| --- | --- | --- |
| [Claude in Chrome side panel](docs/approaches/claude-in-chrome-side-panel.md) | ✅ Detectable | Marker observed in extension 1.0.85 |
| [Claude Desktop — Chrome connector](docs/approaches/claude-desktop-chrome-connector.md) | ✅ Detectable | Marker observed with Desktop 1.3109.9 + extension 1.0.85 |
| [Claude Code — Chrome](docs/approaches/claude-code-chrome.md) | ✅ Detectable | Marker observed with Claude Code 2.1.240 + extension 1.0.85 |
| [Claude Desktop — Browser pane](docs/approaches/claude-desktop-browser-pane.md) | ✅ Detectable | Claude UA token and ref-tracking globals observed in Desktop 1.34493.1 |
| [Claude Desktop — Computer Use](docs/approaches/claude-desktop-computer-use.md) | ⛔ Not testable | Browser access is view-only in Desktop 1.34493.1 |
| [ChatGPT Desktop — Codex Browser](docs/approaches/chatgpt-desktop-codex-browser.md) | ✅ Detectable | `#codex-browser-sidebar-comments-root` observed in Codex 26.818.41509 |
| [ChatGPT Desktop — Codex + Chrome extension](docs/approaches/chatgpt-desktop-codex-chrome-extension.md) | ✅ Detectable | Overlay marker observed in extension 1.2.27268.51612 |
| [ChatGPT Desktop — Codex Computer Use](docs/approaches/chatgpt-desktop-codex-computer-use.md) | ❌ No known signal | Version 26.818.41509 |
| [Playwright MCP](docs/approaches/playwright-mcp.md) | ❌ No known signal | No signal in `@playwright/mcp` 0.0.79 default launch; other configurations may differ |
| [Chrome DevTools MCP](docs/approaches/chrome-devtools-mcp.md) | ⚠️ Opt-in only | Can only detect signals from experimental usage |

Other products, API reference harnesses, and generic agent frameworks are listed only in the [appendix](docs/appendix.md).

## Run locally

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm test
npm run typecheck
npm run build
```

The lab has no backend, telemetry, persistence, screenshots, or run exports. The current result is visible as selectable JSON on the page.

## Reuse the detector

Copy `src/detector/` into a product and own the response policy in a subscription callback:

```ts
import {
  createAgenticUseDetector,
  defaultProbes,
} from "./src/detector/index.js";

const detector = createAgenticUseDetector(defaultProbes);
const unsubscribe = detector.subscribe((result) => {
  if (result.isAgenticUseDetected) {
    // Product-owned logging, handling, or user experience.
  }
});

detector.start();

// During product teardown:
unsubscribe();
detector.stop();
```

A compile-checked version is in [`examples/product-integration.ts`](examples/product-integration.ts).
