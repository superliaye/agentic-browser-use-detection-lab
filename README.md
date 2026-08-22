# Agentic Browser Use Detection Lab

A public, application-agnostic lab for testing what a web page can deterministically observe when Claude or Codex operates a Chromium browser.

**[Open the live lab](https://superliaye.github.io/agentic-browser-use-detection-lab/)**

The page is the test guide, interaction target, and live result viewer. Select an approach and entry mode, give the generated prompt to that agent, and watch the counter and detection contract. A negative result means **not detected**, never “human.”

## Detection contract

```ts
interface DetectionResult {
  readonly isAgenticUseDetected: boolean;
  readonly isGenericAutomationDetected: boolean;
  readonly signals: readonly DetectionSignal[];
}

type DetectionSignalStatus =
  | "detected_now"
  | "detected_earlier_in_session"
  | "not_detected"
  | "unsupported"
  | "error";
```

There are no likelihood scores. Each boolean latches independently: product-specific signals set `isAgenticUseDetected`, while generic WebDriver or Playwright signals set `isGenericAutomationDetected`. Per-signal status distinguishes evidence present during the latest inspection from evidence seen earlier in the detector session. `evidence` always contains the latest inspection, including when a previously seen marker is now absent. `unsupported` and `error` describe the latest inspection and take precedence over session history.

A generic automation signal does not determine whether an agent or another automation harness caused it. “Deterministic” assumes normal, non-adversarial tooling; page-visible state can be removed or forged.

The current probes inspect:

- Claude in Chrome active and retained DOM markers.
- The Codex built-in Browser context root.
- `navigator.webdriver`.
- Playwright's `window.__playwright__binding__` and `window.__pwInitScripts` globals.

See [detection mechanisms](docs/detection/) and [browser observability limits](docs/detection/browser-observability-limits.md).

## Approach catalog

Sources were inspected on 2026-08-22. The Codex built-in Browser flow was manually inspected in version 26.818.41509; each approach page records whether the remaining conclusions are source-grounded, conditionally detectable, or still untested.

| Approach | Modes | Agentic detection | Generic automation detection | Current limitation | Notes |
| --- | --- | --- | --- | --- | --- |
| [Claude in Chrome side panel](docs/approaches/claude-in-chrome-side-panel.md) | Launch, takeover | Marker-triggered | Conditional | Coverage across current extension versions is not established | Active marker transition manually observed |
| [Claude Desktop + Chrome connector](docs/approaches/claude-desktop-chrome-connector.md) | Launch, takeover | Marker-triggered | Conditional | Marker coverage not revalidated in the current extension | Uses Claude in Chrome |
| [Claude Code + Chrome](docs/approaches/claude-code-chrome.md) | Launch | Marker-triggered | Conditional | Marker coverage not revalidated in the current extension | Official integration opens task tabs |
| [Claude Code Desktop Browser pane](docs/approaches/claude-code-desktop-browser-pane.md) | Launch, takeover | No known signal | No known signal | Product flow not manually inspected | Separate in-app profile |
| [Claude Code Computer Use](docs/approaches/claude-computer-use.md) | None | Not testable | Not testable | Browsers are currently view-only in the CLI flow | Listed to make the limitation explicit |
| [Codex built-in Browser](docs/approaches/codex-built-in-browser.md) | Launch, takeover | Marker-triggered | Not observed | Marker inspected only in Codex 26.818.41509 | `#codex-browser-sidebar-comments-root` |
| [Codex Chrome extension](docs/approaches/codex-chrome-extension.md) | Launch, takeover | No known signal | Untested | No product-specific page marker is known | Uses the user's Chrome profile |
| [Codex Computer Use](docs/approaches/codex-computer-use.md) | Launch, takeover | No known signal | Untested | Native input may be page-unobservable | macOS and Windows desktop flow |
| [Claude Code + Playwright MCP](docs/approaches/claude-code-playwright-mcp.md) | Launch | No | Conditional | Generic signals do not identify Claude | WebDriver or Playwright globals |
| [Claude Code + Chrome DevTools MCP](docs/approaches/claude-code-chrome-devtools-mcp.md) | Launch, takeover | No | Conditional | CDP alone has no current reliable probe | WebDriver may appear in launched browsers |
| [Codex + Playwright MCP](docs/approaches/codex-playwright-mcp.md) | Launch | No | Conditional | Generic signals do not identify Codex | WebDriver or Playwright globals |
| [Codex + Chrome DevTools MCP](docs/approaches/codex-chrome-devtools-mcp.md) | Launch, takeover | No | Conditional | CDP alone has no current reliable probe | WebDriver may appear in launched browsers |

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
