export type EntryMode = "launch" | "takeover";

export const TEST_URL_PLACEHOLDER = "{testUrl}";

export interface ApproachModeInstructions {
  readonly mode: EntryMode;
  readonly steps: readonly string[];
}

export interface AgenticApproach {
  readonly id: string;
  readonly name: string;
  readonly provider: "Anthropic" | "Google" | "Microsoft" | "OpenAI";
  readonly summary: string;
  readonly modes: readonly EntryMode[];
  readonly instructions: readonly ApproachModeInstructions[];
  readonly docsPath: string;
  readonly expectedSignalIds: readonly string[];
  readonly promptSetup?: string;
  readonly unavailableReason?: string;
}

export const AGENTIC_APPROACHES: readonly AgenticApproach[] = [
  {
    id: "claude-in-chrome-side-panel",
    name: "Claude in Chrome side panel",
    provider: "Anthropic",
    summary: "Claude controls tabs through Anthropic's Chrome extension side panel.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Install Claude in Chrome, sign in, and open its side panel.",
          "Copy the generated prompt below into the side panel.",
          "Approve access to this site if Chrome or Claude asks.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          `Keep ${TEST_URL_PLACEHOLDER} open in Chrome and open Claude in Chrome's side panel.`,
          "Copy the generated prompt below into the side panel.",
          "Approve access to this site if Chrome or Claude asks.",
        ],
      },
    ],
    docsPath: "docs/approaches/claude-in-chrome-side-panel.md",
    expectedSignalIds: [
      "claude-active-control-container",
      "claude-prior-control-animation-styles",
    ],
  },
  {
    id: "claude-desktop-chrome-connector",
    name: "Claude Desktop — Chrome connector",
    provider: "Anthropic",
    summary: "A Claude Desktop conversation uses the Claude in Chrome connector.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Install Claude in Chrome and enable its connector in Claude Desktop.",
          "Start a Claude Desktop conversation with the connector enabled.",
          "Copy the generated prompt below and approve browser actions when asked.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          `Open ${TEST_URL_PLACEHOLDER} in Chrome and enable the Claude in Chrome connector in Claude Desktop.`,
          "Start a Claude Desktop conversation, then copy the generated prompt below.",
          "Approve browser actions when asked.",
        ],
      },
    ],
    docsPath: "docs/approaches/claude-desktop-chrome-connector.md",
    expectedSignalIds: [
      "claude-active-control-container",
      "claude-prior-control-animation-styles",
    ],
  },
  {
    id: "claude-code-chrome",
    name: "Claude Code — Chrome",
    provider: "Anthropic",
    summary: "Claude Code controls visible Chromium tabs through Claude in Chrome.",
    modes: ["launch"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Install Claude in Chrome version 1.0.36 or later and sign in to Claude Code with a supported direct Anthropic plan.",
          "Start Claude Code with `claude --chrome` and confirm `/chrome` reports the extension connected.",
          "Copy the generated prompt below into Claude Code and approve browser actions when asked.",
        ],
      },
    ],
    docsPath: "docs/approaches/claude-code-chrome.md",
    expectedSignalIds: [
      "claude-active-control-container",
      "claude-prior-control-animation-styles",
    ],
  },
  {
    id: "claude-desktop-browser-pane",
    name: "Claude Desktop — Browser pane",
    provider: "Anthropic",
    summary: "Claude operates the Browser pane inside the Claude Desktop Code tab.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Open the Code tab in Claude Desktop and start a session.",
          "Open the Browser pane with Cmd+Shift+B on macOS or Ctrl+Shift+B on Windows.",
          "Copy the generated prompt below into the Code session.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          `Open ${TEST_URL_PLACEHOLDER} in the Claude Desktop Code tab's Browser pane.`,
          "Keep that pane selected and copy the generated prompt below into the Code session.",
        ],
      },
    ],
    docsPath: "docs/approaches/claude-desktop-browser-pane.md",
    expectedSignalIds: [
      "claude-desktop-browser-user-agent",
      "claude-ref-tracking-globals",
      "electron-user-agent",
    ],
  },
  {
    id: "claude-desktop-computer-use",
    name: "Claude Desktop — Computer Use (browser view-only)",
    provider: "Anthropic",
    summary: "Claude Desktop Computer Use can inspect browsers, but its browser permission tier is view-only.",
    modes: [],
    instructions: [],
    docsPath: "docs/approaches/claude-desktop-computer-use.md",
    expectedSignalIds: [],
    unavailableReason:
      "This flow cannot click the counter: Claude Desktop Computer Use classifies browsers as view-only.",
  },
  {
    id: "chatgpt-desktop-codex-browser",
    name: "ChatGPT Desktop — Codex Browser",
    provider: "OpenAI",
    summary: "A Codex task uses the Browser pane in the ChatGPT desktop app.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Open a Codex task in the ChatGPT desktop app and open its Browser pane.",
          "Copy the generated prompt below into the task.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          `Open ${TEST_URL_PLACEHOLDER} in the task's Browser pane.`,
          "Keep the pane selected and copy the generated prompt below into the Codex task.",
        ],
      },
    ],
    docsPath: "docs/approaches/chatgpt-desktop-codex-browser.md",
    expectedSignalIds: ["codex-built-in-browser-context"],
  },
  {
    id: "chatgpt-desktop-codex-chrome-extension",
    name: "ChatGPT Desktop — Codex + Chrome extension",
    provider: "OpenAI",
    summary: "Codex controls Chrome through OpenAI's browser extension.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Install the Chrome plugin from the ChatGPT desktop app and its extension in Google Chrome.",
          "Start a new Codex task with the Chrome plugin enabled, then copy the generated prompt below into the task.",
          "Approve site access or browser actions when asked.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          `Keep ${TEST_URL_PLACEHOLDER} open in Google Chrome.`,
          "Start a new Codex task with the Chrome plugin enabled, then copy the generated prompt below into the task.",
          "Approve site access or browser actions when asked.",
        ],
      },
    ],
    docsPath: "docs/approaches/chatgpt-desktop-codex-chrome-extension.md",
    expectedSignalIds: ["codex-extension-agent-overlay-root"],
    promptSetup:
      'First initialize the installed Google Chrome browser-control client and select agent.browsers.get("chrome"). List the open Chrome tabs to verify the connection. Do not declare the native host unavailable or outdated without attempting browser setup and reporting the exact setup error. Use Google Chrome, not Edge or the built-in browser. After opening or selecting the test page, report its tab ID, title, and URL, and continue in that same tab without opening another copy.',
  },
  {
    id: "chatgpt-desktop-codex-computer-use",
    name: "ChatGPT Desktop — Codex Computer Use",
    provider: "OpenAI",
    summary: "A Codex task visually operates a permitted Chrome window on the desktop.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Open a Codex task in the ChatGPT desktop app and enable Computer Use.",
          "Grant screen, accessibility, and Chrome app permissions when asked.",
          "Copy the generated prompt below into the task.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          `Open ${TEST_URL_PLACEHOLDER} in a visible Chrome window.`,
          "Enable Computer Use for the Codex task and permit it to use Chrome.",
          "Copy the generated prompt below into the task.",
        ],
      },
    ],
    docsPath: "docs/approaches/chatgpt-desktop-codex-computer-use.md",
    expectedSignalIds: [],
  },
  {
    id: "playwright-mcp",
    name: "Playwright MCP",
    provider: "Microsoft",
    summary: "An MCP-capable agent host uses Playwright MCP to control a browser.",
    modes: ["launch"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Configure the official Playwright MCP server in the agent host you want to test and start a fresh session.",
          "Confirm the Playwright browser tools are available.",
          "Copy the generated prompt below into that agent host.",
        ],
      },
    ],
    docsPath: "docs/approaches/playwright-mcp.md",
    expectedSignalIds: ["navigator-webdriver", "playwright-window-globals"],
  },
  {
    id: "chrome-devtools-mcp",
    name: "Chrome DevTools MCP",
    provider: "Google",
    summary: "An MCP-capable agent host uses Chrome DevTools MCP to control a launched or connected Chrome.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Configure Chrome DevTools MCP in the agent host you want to test with its normal browser-launch mode.",
          "Start a fresh session and confirm the server tools are available.",
          "Copy the generated prompt below into that agent host.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          `Start Chrome with remote debugging enabled and open ${TEST_URL_PLACEHOLDER} in that Chrome instance.`,
          "Configure Chrome DevTools MCP to connect to that instance, then start or restart the agent host.",
          "Copy the generated prompt below into that agent host.",
        ],
      },
    ],
    docsPath: "docs/approaches/chrome-devtools-mcp.md",
    expectedSignalIds: [],
  },
];

const APPROACH_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  "claude-code-desktop-browser-pane": "claude-desktop-browser-pane",
  "claude-computer-use": "claude-desktop-computer-use",
  "codex-built-in-browser": "chatgpt-desktop-codex-browser",
  "codex-chrome-extension": "chatgpt-desktop-codex-chrome-extension",
  "codex-computer-use": "chatgpt-desktop-codex-computer-use",
  "claude-code-playwright-mcp": "playwright-mcp",
  "codex-playwright-mcp": "playwright-mcp",
  "claude-code-chrome-devtools-mcp": "chrome-devtools-mcp",
  "codex-chrome-devtools-mcp": "chrome-devtools-mcp",
});

export function getApproach(id: string): AgenticApproach {
  const canonicalId = APPROACH_ALIASES[id] ?? id;
  const approach = AGENTIC_APPROACHES.find(
    (candidate) => candidate.id === canonicalId,
  );

  if (approach === undefined) {
    throw new Error(`Unknown agentic approach: ${id}`);
  }

  return approach;
}

export function getModeInstructions(
  approach: AgenticApproach,
  mode: EntryMode,
): ApproachModeInstructions {
  const instructions = approach.instructions.find((candidate) => candidate.mode === mode);

  if (instructions === undefined) {
    throw new Error(`${approach.name} does not support ${mode} mode`);
  }

  return instructions;
}
