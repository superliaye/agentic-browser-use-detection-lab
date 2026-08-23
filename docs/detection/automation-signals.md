# Automation and cooperative signals

The detector includes two generic automation probes and one informational input probe:

| Signal | Detected when | Conclusion |
| --- | --- | --- |
| `navigator-webdriver` | `navigator.webdriver === true` | Browser automation, provider unknown |
| `playwright-window-globals` | `window.__playwright__binding__` or `window.__pwInitScripts` exists | Playwright instrumentation, agent unknown |
| `cdp-zero-mouse-pressure` | A trusted mouse `pointerdown` has active buttons and `pressure === 0` | Informational only; neither aggregate boolean |

None of these signals proves Claude or Codex. They may be absent when a tool connects to an existing browser, changes launch configuration, or does not expose the inspected artifact. The zero-pressure condition was observed with Chrome DevTools MCP 1.7.0, whose Puppeteer 25.8.0 mouse-down implementation omitted CDP's `force` field; Chromium then supplied `0`. Playwright explicitly supplied `0.5` in the tested comparison. Other CDP clients can produce either value, so the signal has `proves: "nothing"` and is only a visible input artifact.

`cdp-zero-mouse-pressure` evaluates the most recent trusted `pointerdown`, not live pointer activity. Its `detected_now` status persists until another trusted `pointerdown` replaces that observation; it does not mean an agent is currently operating the page.

These signals set `isGenericAutomationDetected` independently from `isAgenticUseDetected`. “Generic” describes the evidence, not the operator: an agent can use Playwright or WebDriver, and a non-agent harness can expose the same signals.

The detector excludes popup tests because they actively change browser state and depend on permissions or launch flags. It also excludes click dwell, movement, typing, and read-to-action timing because they are behavioral heuristics and the public contract has no probability score.

## Cooperative agentic signals

| Signal | Detected when | Conclusion |
| --- | --- | --- |
| `cooperative-webmcp-handshake` | An agent invokes the page-defined WebMCP handshake tool, which leaves `#agentic-use-detection-webmcp-handshake` | Agentic use |
| `chrome-devtools-third-party-bridge` | Chrome DevTools MCP's experimental page-tool discovery creates `window.__dtmcp` | Agentic use |

The WebMCP handshake requires Chrome's `SubmitEvent.agentInvoked === true`; enabling WebMCP, registering the form, or submitting it normally does not create the marker. It proves that an agent invoked this page's WebMCP tool, not that an agent originally launched the browser. The `window.__dtmcp` marker belongs to Chrome DevTools MCP's separate experimental third-party tool bridge (`--category-experimental-third-party`) and is not treated as WebMCP. Both are cooperative, page-visible artifacts for recorded, non-adversarial tooling, not universal or tamper-resistant attestations.

The separate `electron-user-agent` signal does not conclude generic automation. Electron identifies an application runtime, not whether that runtime is automated.

When an artifact is present during the latest inspection, its signal status is `detected_now`. If it disappears after being observed, the status becomes `detected_earlier_in_session`; the aggregate boolean remains `true`. This status describes the inspected artifact, not whether an agent is actively operating the page.

Sources inspected 2026-08-23:

- [MDN — `navigator.webdriver`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver)
- [Castle — Playwright detection techniques](https://blog.castle.io/how-to-detect-headless-chrome-bots-instrumented-with-playwright/)
- [Puppeteer 25.8.0 mouse input](https://github.com/puppeteer/puppeteer/blob/puppeteer-v25.8.0/packages/puppeteer-core/src/cdp/Input.ts)
- [Playwright Chromium mouse input](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/chromium/crInput.ts)
- [Chromium CDP input handler](https://github.com/chromium/chromium/blob/main/content/browser/devtools/protocol/input_handler.cc)
- [Chrome WebMCP declarative API](https://developer.chrome.com/docs/ai/webmcp/declarative-api)
- [Chrome DevTools MCP WebMCP tools](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/src/tools/webmcp.ts)
- [Chrome DevTools MCP third-party bridge](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/src/McpPage.ts)
