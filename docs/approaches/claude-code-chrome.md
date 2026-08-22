# Claude Code + Chrome

## What it is

Claude Code CLI or VS Code connects to Claude in Chrome, opens visible task tabs, and uses the browser's existing login state.

## Test

Supported mode: **launch**. The official flow opens new tabs for browser tasks.

1. Install Claude in Chrome 1.0.36 or later.
2. Sign in to Claude Code with a direct Anthropic Pro, Max, Team, or Enterprise plan; API-key and third-party-provider authentication do not enable this integration.
3. Start `claude --chrome` and confirm `/chrome` reports the extension connected.
4. Select this approach in the [lab](https://superliaye.github.io/agentic-browser-use-detection-lab/?approach=claude-code-chrome&mode=launch) and give Claude the generated prompt.

## Detection

The detector watches the Claude active-control and retained-style markers. A signal distinguishes a marker present now from one observed earlier in the detector session; either state keeps `isAgenticUseDetected` latched. Generic automation is reported separately only when a WebDriver or Playwright signal appears. The lab has not established that every current Claude Code + Chrome action emits either Claude marker.

## Live Snapshot
<img width="2020" height="964" alt="image" src="https://github.com/user-attachments/assets/1bf2f3c1-bd76-4da4-be16-73f5c680e16f" />

## Inspection

- Official docs inspected: 2026-08-22.
- Product test: not manually performed.
- Documented prerequisites: Claude in Chrome 1.0.36+; browser selection requires Claude Code 2.1.154+.

Sources: [Anthropic — Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome), [CHEQ marker research](https://cheq.ai/blog/the-cyborg-session-reversing-detecting-claude-ai-agent-chrome-extension/).
