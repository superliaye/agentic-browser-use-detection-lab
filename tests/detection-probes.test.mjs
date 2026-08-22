import assert from "node:assert/strict";
import test from "node:test";

import {
  claudeActiveControlProbe,
  claudePriorControlProbe,
  playwrightWindowGlobalsProbe,
  webdriverProbe,
} from "../.test-dist/src/detector/probes/index.js";

function createEnvironment({ selector, webdriver, windowProperty } = {}) {
  return {
    getNavigatorWebdriver: () => webdriver,
    hasWindowProperty: (name) => name === windowProperty,
    hasElement: (candidate) => candidate === selector,
    subscribeToDocumentChanges: () => undefined,
  };
}

function inspectWithSelector(probe, selector) {
  return probe.inspect(createEnvironment({ selector }));
}

function inspectWithWebdriver(webdriver) {
  return webdriverProbe.inspect(createEnvironment({ webdriver }));
}

function inspectWithWindowProperty(windowProperty) {
  return playwrightWindowGlobalsProbe.inspect(createEnvironment({ windowProperty }));
}

test("detects Claude active-control container as agentic use", () => {
  const observation = inspectWithSelector(
    claudeActiveControlProbe,
    "#claude-agent-stop-container",
  );

  assert.equal(observation.status, "detected");
  assert.deepEqual(observation.evidence, {
    selector: "#claude-agent-stop-container",
    present: true,
  });
});

test("detects Claude retained animation style as prior agentic use", () => {
  const observation = inspectWithSelector(
    claudePriorControlProbe,
    "#claude-agent-animation-styles",
  );

  assert.equal(observation.status, "detected");
  assert.deepEqual(observation.evidence, {
    selector: "#claude-agent-animation-styles",
    present: true,
  });
});

test("detects navigator.webdriver as automation", () => {
  const observation = inspectWithWebdriver(true);

  assert.equal(observation.status, "detected");
  assert.deepEqual(observation.evidence, { webdriver: true });
});

test("detects either Playwright global as automation", () => {
  const bindingObservation = inspectWithWindowProperty("__playwright__binding__");
  const initScriptObservation = inspectWithWindowProperty("__pwInitScripts");

  assert.equal(bindingObservation.status, "detected");
  assert.equal(initScriptObservation.status, "detected");
});

test("keeps absent and unsupported WebDriver evidence distinct", () => {
  const absentObservation = inspectWithWebdriver(false);
  const unsupportedObservation = inspectWithWebdriver(undefined);

  assert.equal(absentObservation.status, "not_detected");
  assert.deepEqual(absentObservation.evidence, { webdriver: false });
  assert.equal(unsupportedObservation.status, "unsupported");
  assert.deepEqual(unsupportedObservation.evidence, { webdriverAvailable: false });
});
