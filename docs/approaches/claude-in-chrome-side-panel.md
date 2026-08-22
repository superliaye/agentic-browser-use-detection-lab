# Claude in Chrome side panel

## What it is

Anthropic's Chrome extension opens Claude beside the current tab and can read or act on permitted pages in the user's signed-in Chrome profile.

## Test

Supported modes: **launch** and **takeover**.

1. Install Claude in Chrome, sign in, and open the side panel.
2. In the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=claude-in-chrome-side-panel&mode=takeover), select the intended mode.
3. Give Claude the generated prompt and approve site access if asked.
4. Observe the counter and live detection result.

## Detection

The detector concludes agentic use if `#claude-agent-stop-container` or `#claude-agent-animation-styles` appears. The first is reported during active control; the second is reported to persist after control. Either also concludes automation.

No marker means only “not detected.” The markers come from third-party reverse engineering and were not manually revalidated against the current extension in this lab.

## Inspection

- Sources inspected: 2026-08-22.
- Product test: not manually performed.
- Version: current extension version not recorded; marker research published 2026-02-18.

Sources: [Anthropic setup guide](https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome), [CHEQ marker research](https://cheq.ai/blog/the-cyborg-session-reversing-detecting-claude-ai-agent-chrome-extension/).
