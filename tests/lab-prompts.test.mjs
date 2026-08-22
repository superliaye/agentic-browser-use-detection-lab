import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import {
  AGENTIC_APPROACHES,
  getApproach,
} from "../.test-dist/src/lab/approaches.js";
import { buildLaunchUrl, buildTestPrompt } from "../.test-dist/src/lab/prompts.js";

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

test("unsupported modes are rejected", () => {
  assert.throws(
    () => buildTestPrompt(getApproach("claude-code-chrome"), "takeover"),
    /does not support takeover mode/,
  );
});

test("Claude Code Computer Use is represented as browser view-only", () => {
  const approach = getApproach("claude-computer-use");

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
      "codex-built-in-browser",
    ),
  );

  assert.equal(url.searchParams.get("approach"), "codex-built-in-browser");
  assert.equal(url.searchParams.get("mode"), "launch");
});

test("catalog exposes twelve distinct Claude and Codex approaches", () => {
  assert.equal(AGENTIC_APPROACHES.length, 12);
  assert.equal(new Set(AGENTIC_APPROACHES.map(({ id }) => id)).size, 12);
});

test("every catalog documentation link resolves to a repository file", () => {
  for (const approach of AGENTIC_APPROACHES) {
    assert.equal(existsSync(approach.docsPath), true, approach.docsPath);
  }
});
