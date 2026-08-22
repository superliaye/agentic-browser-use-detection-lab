# Claude Desktop + Chrome connector

## What it is

A Claude Desktop Chat, Cowork, or Code conversation uses the Claude in Chrome connector to operate permitted pages in the user's Chrome profile.

## Test

Supported modes: **launch** and **takeover**.

1. Install Claude in Chrome and enable the connector in Claude Desktop.
2. Start a Desktop conversation with the connector enabled.
3. Open the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=claude-desktop-chrome-connector&mode=takeover), copy its generated prompt, and approve browser actions if asked.

## Detection

Because this flow uses Claude in Chrome, the detector watches the same active and retained DOM markers. A marker deterministically attributes the observed artifact to Claude agent control. Generic automation is reported separately only when a WebDriver or Playwright signal appears.

Coverage across current Desktop and extension versions is unverified. A negative result does not distinguish a missed marker from no agent use.

## Inspection

- Sources inspected: 2026-08-22.
- Product test: not manually performed.
- Versions: not recorded by this lab.

Sources: [Anthropic Claude in Chrome setup](https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome), [CHEQ marker research](https://cheq.ai/blog/the-cyborg-session-reversing-detecting-claude-ai-agent-chrome-extension/).
