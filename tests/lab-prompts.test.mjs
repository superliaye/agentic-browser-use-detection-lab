import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import {
  AGENTIC_APPROACHES,
  getApproach,
} from "../.test-dist/src/lab/approaches.js";
import * as promptBuilders from "../.test-dist/src/lab/prompts.js";
import { handleWebMcpSubmit } from "../.test-dist/src/lab/webmcp-handshake.js";

const { buildLaunchUrl, buildTestPrompt } = promptBuilders;

test("launch prompt includes generated URL and counter instruction", () => {
  const url = buildLaunchUrl(
    "https://superliaye.github.io/agentic-browser-use-detection-lab/",
    "claude-code-chrome",
  );
  const prompt = buildTestPrompt(getApproach("claude-code-chrome"), "launch", url);

  assert.match(prompt, /https:\/\/superliaye\.github\.io/);
  assert.match(prompt, /Increment counter/);
});

test("takeover prompt targets the current page without a URL", () => {
  const prompt = buildTestPrompt(
    getApproach("claude-in-chrome-side-panel"),
    "takeover",
  );

  assert.match(prompt, /current page/);
  assert.doesNotMatch(prompt, /https:\/\//);
});

test("every takeover guide includes the exact test URL to open", () => {
  assert.equal(typeof promptBuilders.buildTestUrl, "function");
  assert.equal(typeof promptBuilders.buildGuideSteps, "function");

  for (const approach of AGENTIC_APPROACHES.filter(({ modes }) =>
    modes.includes("takeover"),
  )) {
    const testUrl = promptBuilders.buildTestUrl(
      "https://superliaye.github.io/agentic-browser-use-detection-lab/",
      approach.id,
      "takeover",
    );
    const steps = promptBuilders.buildGuideSteps(
      approach,
      "takeover",
      testUrl,
    );

    assert.equal(steps[0]?.includes(testUrl), true, approach.id);
  }
});

test("unsupported modes are rejected", () => {
  assert.throws(
    () => buildTestPrompt(getApproach("claude-code-chrome"), "takeover"),
    /does not support takeover mode/,
  );
});

test("Claude Desktop Computer Use is represented as browser view-only", () => {
  const approach = getApproach("claude-desktop-computer-use");

  assert.deepEqual(approach.modes, []);
  assert.throws(
    () => buildTestPrompt(approach, "launch", "https://example.test/"),
    /does not support launch mode/,
  );
});

test("query selections round-trip through a Pages subpath URL", () => {
  const url = new URL(
    buildLaunchUrl(
      "https://superliaye.github.io/agentic-browser-use-detection-lab/",
      "chatgpt-desktop-codex-browser",
    ),
  );

  assert.equal(
    url.searchParams.get("approach"),
    "chatgpt-desktop-codex-browser",
  );
  assert.equal(url.searchParams.get("mode"), "launch");
});

test("catalog exposes one approach per model-independent MCP controller", () => {
  assert.equal(getApproach("playwright-mcp").name, "Playwright MCP");
  assert.equal(getApproach("chrome-devtools-mcp").name, "Chrome DevTools MCP");
  assert.equal(
    AGENTIC_APPROACHES.filter(({ name }) => name.includes("Playwright MCP")).length,
    1,
  );
  assert.equal(
    AGENTIC_APPROACHES.filter(({ name }) => name.includes("Chrome DevTools MCP"))
      .length,
    1,
  );
});

test("Chrome DevTools MCP prompt keeps the cooperative handshake optional", () => {
  const approach = getApproach("chrome-devtools-mcp");
  const prompt = buildTestPrompt(
    approach,
    "launch",
    "https://example.test/?approach=chrome-devtools-mcp&mode=launch",
  );

  assert.match(prompt, /If execute_webmcp_tool is available/);
  assert.match(prompt, /do not substitute another MCP server or controller/i);
  assert.deepEqual(approach.expectedSignalIds, [
    "navigator-webdriver",
    "cdp-zero-mouse-pressure",
    "cdp-runtime-serialization-observer",
    "cooperative-webmcp-handshake",
    "chrome-devtools-third-party-bridge",
  ]);
});

test("WebMCP handshake ignores normal form submission", () => {
  let prevented = false;
  let marked = false;
  const handled = handleWebMcpSubmit(
    {
      preventDefault() {
        prevented = true;
      },
    },
    () => {
      marked = true;
    },
  );

  assert.equal(handled, false);
  assert.equal(prevented, true);
  assert.equal(marked, false);
});

test("WebMCP handshake records browser-declared agent invocation", async () => {
  let response;
  const handled = handleWebMcpSubmit(
    {
      agentInvoked: true,
      preventDefault() {},
      respondWith(result) {
        response = result;
      },
    },
    () => ({ detected: true }),
  );

  assert.equal(handled, true);
  assert.deepEqual(await response, { detected: true });
});

test("catalog names identify the desktop host for embedded browser approaches", () => {
  assert.equal(
    getApproach("claude-desktop-browser-pane").name,
    "Claude Desktop — Browser pane",
  );
  assert.equal(
    getApproach("chatgpt-desktop-codex-browser").name,
    "ChatGPT Desktop — Codex Browser",
  );
});

test("renamed approach URLs resolve to their canonical catalog entries", () => {
  const aliases = {
    "claude-code-desktop-browser-pane": "claude-desktop-browser-pane",
    "claude-computer-use": "claude-desktop-computer-use",
    "codex-built-in-browser": "chatgpt-desktop-codex-browser",
    "codex-chrome-extension": "chatgpt-desktop-codex-chrome-extension",
    "codex-computer-use": "chatgpt-desktop-codex-computer-use",
    "claude-code-playwright-mcp": "playwright-mcp",
    "codex-playwright-mcp": "playwright-mcp",
    "claude-code-chrome-devtools-mcp": "chrome-devtools-mcp",
    "codex-chrome-devtools-mcp": "chrome-devtools-mcp",
  };

  for (const [legacyId, canonicalId] of Object.entries(aliases)) {
    assert.equal(getApproach(legacyId).id, canonicalId, legacyId);
  }
});

test("catalog exposes ten distinct canonical approaches", () => {
  assert.equal(AGENTIC_APPROACHES.length, 10);
  assert.equal(new Set(AGENTIC_APPROACHES.map(({ id }) => id)).size, 10);
});

test("every catalog documentation link resolves to a repository file", () => {
  for (const approach of AGENTIC_APPROACHES) {
    assert.equal(existsSync(approach.docsPath), true, approach.docsPath);
  }
});
