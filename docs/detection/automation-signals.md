# Generic automation signals

The detector includes two narrow automation probes:

| Signal | Detected when | Conclusion |
| --- | --- | --- |
| `navigator-webdriver` | `navigator.webdriver === true` | Browser automation, provider unknown |
| `playwright-window-globals` | `window.__playwright__binding__` or `window.__pwInitScripts` exists | Playwright instrumentation, agent unknown |

Neither signal proves Claude or Codex. They may be absent when a tool connects to an existing browser, changes launch configuration, or does not expose the inspected artifact. The detector deliberately excludes user-agent, timing, mouse-path, and typing heuristics because the public contract has no probability score.

These signals set `isGenericAutomationDetected` independently from `isAgenticUseDetected`. “Generic” describes the evidence, not the operator: an agent can use Playwright or WebDriver, and a non-agent harness can expose the same signals.

When an artifact is present during the latest inspection, its signal status is `detected_now`. If it disappears after being observed, the status becomes `detected_earlier_in_session`; the aggregate boolean remains `true`. This status describes the inspected artifact, not whether an agent is actively operating the page.

Sources inspected 2026-08-22:

- [MDN — `navigator.webdriver`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver)
- [Castle — Playwright detection techniques](https://blog.castle.io/how-to-detect-headless-chrome-bots-instrumented-with-playwright/)
