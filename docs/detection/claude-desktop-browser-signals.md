# Claude Desktop Browser signals

The Claude Code Desktop in-app Browser exposes three independently reported signals:

| Signal | Detected when | Conclusion |
| --- | --- | --- |
| `claude-desktop-browser-user-agent` | `navigator.userAgent` contains `Claude/<version>` | Agentic use |
| `claude-ref-tracking-globals` | `window.__claudeElementMap` and `window.__claudeRefCounter` exist | Agentic use |
| `electron-user-agent` | `navigator.userAgent` contains `Electron/<version>` | Informational only |

For this lab, a page loaded in a Claude agentic browser context counts as agentic use. Either Claude-specific signal therefore sets `isAgenticUseDetected`, even though neither attributes a particular interaction. Electron alone identifies a broad application runtime and sets neither aggregate boolean.

The ref-globals probe also reports whether `window.__claudeElementReverseMap` exists, but does not require it. Anthropic's public browser-use quickstart initializes the element map and ref counter when its accessibility-tree implementation runs; the reverse map was observed in Claude Desktop but is not part of that public implementation.

The signals were observed on 2026-08-22 with this user agent:

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)Claude/1.34493.1 Chrome/148.0.7778.280 Electron/42.9.2 Safari/537.36 MSIX
```

The user-agent probe runs in page JavaScript. A server can inspect the same user-agent token in the HTTP request. These are implementation artifacts, not a supported Anthropic detection API, and can change or be forged.

The lab does not treat `outerWidth === 0` as a signal. Window geometry is not specific to Claude, Electron, automation, or agentic use.

Sources:

- [Anthropic — Claude Code Desktop](https://code.claude.com/docs/en/desktop#preview-your-app)
- [Anthropic browser-use ref-tracking implementation](https://github.com/anthropics/claude-quickstarts/blob/5264b729deda905dba3e5402d717bebed000325c/browser-use-demo/browser_use_demo/browser_tool_utils/browser_dom_script.js)
