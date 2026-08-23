# Agentic Browser Use Detection Lab

A application-agnostic lab for testing what a web page can deterministically observe when Claude or Codex operates a Chromium browser.

**[Open the live lab](https://superliaye.github.io/agentic-browser-use-detection-lab/)**

See [detection mechanisms](docs/detection/) and [browser observability limits](docs/detection/browser-observability-limits.md).

## Approach catalog

Select an approach name to open its test instructions, observed signals, versions, and detection limits.

**Agentic detection:** ✅ Detectable · ⚠️ Conditional · ❌ No known signal · ⛔ Not testable

| Approach — open details | Agentic detection | Current limitation | Notes |
| --- | --- | --- | --- |
| [Claude in Chrome side panel](docs/approaches/claude-in-chrome-side-panel.md) | ✅ Detectable | Coverage across current extension versions is not established | Active marker transition manually observed |
| [Claude Desktop — Chrome connector](docs/approaches/claude-desktop-chrome-connector.md) | ✅ Detectable | Versions beyond Desktop 1.3109.9 and extension 1.0.85 are unverified | Uses Claude in Chrome |
| [Claude Code — Chrome](docs/approaches/claude-code-chrome.md) | ✅ Detectable | Versions beyond Claude Code 2.1.240 and extension 1.0.85 are unverified | Official integration opens task tabs |
| [Claude Desktop — Browser pane](docs/approaches/claude-desktop-browser-pane.md) | ✅ Detectable | Signals inspected only in Claude Desktop 1.34493.1 (255293) | Code tab; separate in-app profile |
| [Claude Desktop — Computer Use](docs/approaches/claude-desktop-computer-use.md) | ⛔ Not testable | Browsers are view-only in Desktop 1.34493.1 (255293) | Limitation fully inspected |
| [ChatGPT Desktop — Codex Browser](docs/approaches/chatgpt-desktop-codex-browser.md) | ✅ Detectable | Marker inspected only in Codex 26.818.41509 | `#codex-browser-sidebar-comments-root` |
| [ChatGPT Desktop — Codex + Chrome extension](docs/approaches/chatgpt-desktop-codex-chrome-extension.md) | ✅ Detectable | Verified with extension 1.2.27268.51612 | Retained agent-overlay root |
| [ChatGPT Desktop — Codex Computer Use](docs/approaches/chatgpt-desktop-codex-computer-use.md) | ❌ No known signal | Same result expected for takeover but not separately inspected | Product, browser, and OS versions not recorded |
| [Playwright MCP](docs/approaches/playwright-mcp.md) | ❌ No known signal | No passive deterministic signal found in the tested configuration | Other configurations may expose generic automation signals |
| [Chrome DevTools MCP](docs/approaches/chrome-devtools-mcp.md) | ⚠️ Conditional | Normal CDP control has no agent-specific probe | Detectable through cooperative or bridge signals |

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
