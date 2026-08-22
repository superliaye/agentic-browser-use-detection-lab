# Claude in Chrome markers

The runtime detector watches two DOM IDs reported by CHEQ's reverse engineering of Claude in Chrome:

- `#claude-agent-stop-container`: the active-control overlay container. Its presence concludes `agentic_use`.
- `#claude-agent-animation-styles`: a style element reported to remain after control ends. Its presence concludes prior `agentic_use` in the detector session.

Either detected signal sets `isAgenticUseDetected`. Results latch even if the extension later removes the element. These product-specific markers do not set `isGenericAutomationDetected`; that verdict is reserved for independent WebDriver and Playwright signals.

These are implementation artifacts, not an Anthropic detection API. CHEQ published the finding on 2026-02-18; this project inspected the research on 2026-08-22 but did not manually revalidate the current extension. A missing marker therefore means only “not detected.”

The lab does not probe a web-accessible extension asset. Installation proves capability, not use, and the reported hashed asset name is version-sensitive.

Source: [CHEQ — The Cyborg Session: Reversing & Detecting Claude AI Agent Chrome Extension](https://cheq.ai/blog/the-cyborg-session-reversing-detecting-claude-ai-agent-chrome-extension/)
