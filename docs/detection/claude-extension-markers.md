# Claude in Chrome markers

The runtime detector watches two DOM IDs reported by CHEQ's reverse engineering of Claude in Chrome:

- `#claude-agent-stop-container`: the active-control overlay container. Its presence concludes `agentic_use`.
- `#claude-agent-animation-styles`: a style element reported to remain after control ends. Its presence concludes prior `agentic_use` in the detector session.

The detector re-inspects both markers after DOM mutations. Each signal reports:

- `detected_now` when its element is present during the latest inspection.
- `detected_earlier_in_session` when its element was observed by this detector instance but is now absent.
- `not_detected` when its element has not been observed in this detector session.

The status describes whether that marker is currently present, not whether Claude is actively controlling the page. In particular, the retained animation-style signal can be `detected_now` after control has ended. Its current `evidence` remains the latest point-in-time observation.

Either marker latches `isAgenticUseDetected` to `true`, even if the extension later removes the element. These product-specific markers do not set `isGenericAutomationDetected`; that verdict is reserved for independent WebDriver and Playwright signals.

These are implementation artifacts, not an Anthropic detection API. CHEQ published the finding on 2026-02-18; this project inspected the research on 2026-08-22. A manual Claude in Chrome lab run on 2026-08-22 observed the active-control container appear during operation and disappear afterward; the extension version was not recorded. A marker that remains `not_detected` means only that the marker was not observed.

The lab does not probe a web-accessible extension asset. Installation proves capability, not use, and the reported hashed asset name is version-sensitive.

Source: [CHEQ — The Cyborg Session: Reversing & Detecting Claude AI Agent Chrome Extension](https://cheq.ai/blog/the-cyborg-session-reversing-detecting-claude-ai-agent-chrome-extension/)
