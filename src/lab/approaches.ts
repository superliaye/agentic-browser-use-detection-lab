export type EntryMode = "launch" | "takeover";

export interface ApproachModeInstructions {
  readonly mode: EntryMode;
  readonly steps: readonly string[];
}

export interface AgenticApproach {
  readonly id: string;
  readonly name: string;
  readonly provider: "Anthropic" | "OpenAI";
  readonly summary: string;
  readonly modes: readonly EntryMode[];
  readonly instructions: readonly ApproachModeInstructions[];
  readonly docsPath: string;
  readonly expectedSignalIds: readonly string[];
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
          "Keep this lab open in Chrome and open Claude in Chrome's side panel.",
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
    name: "Claude Desktop + Chrome connector",
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
          "Open this lab in Chrome and enable the Claude in Chrome connector in Claude Desktop.",
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
    name: "Claude Code + Chrome",
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
    id: "claude-code-desktop-browser-pane",
    name: "Claude Code Desktop Browser pane",
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
          "Open this lab in the Claude Desktop Code tab's Browser pane.",
          "Keep that pane selected and copy the generated prompt below into the Code session.",
        ],
      },
    ],
    docsPath: "docs/approaches/claude-code-desktop-browser-pane.md",
    expectedSignalIds: [],
  },
  {
    id: "claude-computer-use",
    name: "Claude Code Computer Use (browser view-only)",
    provider: "Anthropic",
    summary: "The CLI computer-use server can see browsers, but Anthropic currently limits them to view-only control.",
    modes: [],
    instructions: [],
    docsPath: "docs/approaches/claude-computer-use.md",
    expectedSignalIds: [],
    unavailableReason:
      "This flow cannot click the counter: current Claude Code CLI documentation classifies browsers as view-only for Computer Use.",
  },
  {
    id: "codex-built-in-browser",
    name: "Codex built-in Browser",
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
          "Open this lab in the task's Browser pane.",
          "Keep the pane selected and copy the generated prompt below into the Codex task.",
        ],
      },
    ],
    docsPath: "docs/approaches/codex-built-in-browser.md",
    expectedSignalIds: ["codex-built-in-browser-context"],
  },
  {
    id: "codex-chrome-extension",
    name: "Codex Chrome extension",
    provider: "OpenAI",
    summary: "Codex controls Chrome through OpenAI's browser extension.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Install and sign in to the OpenAI Chrome extension, then open its panel.",
          "Copy the generated prompt below into the extension.",
          "Approve site access or browser actions when asked.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          "Keep this lab open in Chrome and open the OpenAI extension panel.",
          "Copy the generated prompt below into the extension and approve access when asked.",
        ],
      },
    ],
    docsPath: "docs/approaches/codex-chrome-extension.md",
    expectedSignalIds: [],
  },
  {
    id: "codex-computer-use",
    name: "Codex Computer Use",
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
          "Open this lab in a visible Chrome window.",
          "Enable Computer Use for the Codex task and permit it to use Chrome.",
          "Copy the generated prompt below into the task.",
        ],
      },
    ],
    docsPath: "docs/approaches/codex-computer-use.md",
    expectedSignalIds: [],
  },
  {
    id: "claude-code-playwright-mcp",
    name: "Claude Code + Playwright MCP",
    provider: "Anthropic",
    summary: "Claude Code uses the Playwright MCP server to control a browser.",
    modes: ["launch"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Configure the official Playwright MCP server in Claude Code and start a fresh session.",
          "Confirm the Playwright browser tools are available.",
          "Copy the generated prompt below into Claude Code.",
        ],
      },
    ],
    docsPath: "docs/approaches/claude-code-playwright-mcp.md",
    expectedSignalIds: ["navigator-webdriver", "playwright-window-globals"],
  },
  {
    id: "claude-code-chrome-devtools-mcp",
    name: "Claude Code + Chrome DevTools MCP",
    provider: "Anthropic",
    summary: "Claude Code uses Chrome DevTools MCP to control a launched or connected Chrome.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Configure Chrome DevTools MCP in Claude Code with its normal browser-launch mode.",
          "Start a fresh Claude Code session and confirm the server tools are available.",
          "Copy the generated prompt below into Claude Code.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          "Start Chrome with remote debugging enabled and open this lab in that Chrome instance.",
          "Configure Chrome DevTools MCP to connect to that instance, then start Claude Code.",
          "Copy the generated prompt below into Claude Code.",
        ],
      },
    ],
    docsPath: "docs/approaches/claude-code-chrome-devtools-mcp.md",
    expectedSignalIds: [],
  },
  {
    id: "codex-playwright-mcp",
    name: "Codex + Playwright MCP",
    provider: "OpenAI",
    summary: "Codex uses the Playwright MCP server to control a browser.",
    modes: ["launch"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Add the official Playwright MCP server to Codex and restart the Codex host.",
          "Confirm the Playwright browser tools are available.",
          "Copy the generated prompt below into the Codex task.",
        ],
      },
    ],
    docsPath: "docs/approaches/codex-playwright-mcp.md",
    expectedSignalIds: ["navigator-webdriver", "playwright-window-globals"],
  },
  {
    id: "codex-chrome-devtools-mcp",
    name: "Codex + Chrome DevTools MCP",
    provider: "OpenAI",
    summary: "Codex uses Chrome DevTools MCP to control a launched or connected Chrome.",
    modes: ["launch", "takeover"],
    instructions: [
      {
        mode: "launch",
        steps: [
          "Add Chrome DevTools MCP to Codex with its normal browser-launch mode and restart the Codex host.",
          "Confirm the server tools are available.",
          "Copy the generated prompt below into the Codex task.",
        ],
      },
      {
        mode: "takeover",
        steps: [
          "Start Chrome with remote debugging enabled and open this lab in that Chrome instance.",
          "Configure Chrome DevTools MCP to connect to that instance and restart the Codex host.",
          "Copy the generated prompt below into the Codex task.",
        ],
      },
    ],
    docsPath: "docs/approaches/codex-chrome-devtools-mcp.md",
    expectedSignalIds: [],
  },
];

export function getApproach(id: string): AgenticApproach {
  const approach = AGENTIC_APPROACHES.find((candidate) => candidate.id === id);

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
