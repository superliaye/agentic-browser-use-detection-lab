# Agentic Browser Use Detection Lab

A application-agnostic lab for testing what a web page can deterministically observe when Claude or Codex operates a Chromium browser.

**[Open the live lab](https://superliaye.github.io/agentic-browser-use-detection-lab/)**

See [detection mechanisms](docs/detection/) and [browser observability limits](docs/detection/browser-observability-limits.md).

## Approach catalog

| Approach | Modes | Agentic detection | Generic automation detection | Current limitation | Notes |
| --- | --- | --- | --- | --- | --- |
| [Claude in Chrome side panel](docs/approaches/claude-in-chrome-side-panel.md) | Launch, takeover | Marker-triggered | Conditional | Coverage across current extension versions is not established | Active marker transition manually observed |
| [Claude Desktop — Chrome connector](docs/approaches/claude-desktop-chrome-connector.md) | Launch, takeover | Marker-triggered | Conditional | Versions beyond Desktop 1.3109.9 and extension 1.0.85 are unverified | Uses Claude in Chrome |
| [Claude Code — Chrome](docs/approaches/claude-code-chrome.md) | Launch | Marker-triggered | Conditional | Versions beyond Claude Code 2.1.240 and extension 1.0.85 are unverified | Official integration opens task tabs |
| [Claude Desktop — Browser pane](docs/approaches/claude-desktop-browser-pane.md) | Launch, takeover | UA or ref globals | Not observed | Signals inspected only in Claude Desktop 1.34493.1 (255293) | Code tab; separate in-app profile |
| [Claude Desktop — Computer Use](docs/approaches/claude-desktop-computer-use.md) | None | Not testable | Not testable | Browsers are view-only in Desktop 1.34493.1 (255293) | Limitation fully inspected |
| [ChatGPT Desktop — Codex Browser](docs/approaches/chatgpt-desktop-codex-browser.md) | Launch, takeover | Marker-triggered | Not observed | Marker inspected only in Codex 26.818.41509 | `#codex-browser-sidebar-comments-root` |
| [ChatGPT Desktop — Codex + Chrome extension](docs/approaches/chatgpt-desktop-codex-chrome-extension.md) | Launch, takeover | Marker-triggered | Not observed | Verified with extension 1.2.27268.51612 | Retained agent-overlay root |
| [ChatGPT Desktop — Codex Computer Use](docs/approaches/chatgpt-desktop-codex-computer-use.md) | Launch, takeover | No known signal | Untested | Native input may be page-unobservable | macOS and Windows desktop flow |
| [Playwright MCP](docs/approaches/playwright-mcp.md) | Launch | No | Not observed in tested default launch | No passive deterministic signal found in the tested configuration | Other configurations may expose existing generic signals |
| [Chrome DevTools MCP](docs/approaches/chrome-devtools-mcp.md) | Launch, takeover | Cooperative or bridge-triggered | Observed in one default launch; takeover untested | Normal CDP control has no agent-specific probe | Server 1.7.0 exposed WebDriver; zero mouse pressure is informational |

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
