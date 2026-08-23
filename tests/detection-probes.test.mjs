import assert from "node:assert/strict";
import test from "node:test";

import {
  cdpRuntimeSerializationObserverProbe,
  cdpZeroMousePressureProbe,
  claudeActiveControlProbe,
  claudePriorControlProbe,
  chromeDevToolsThirdPartyBridgeProbe,
  cooperativeWebMcpHandshakeProbe,
  playwrightWindowGlobalsProbe,
  webdriverProbe,
} from "../.test-dist/src/detector/probes/index.js";

function createEnvironment({
  cdpRuntimeSerializationObserved = false,
  pointerObservation,
  selector,
  userAgent,
  webdriver,
  windowProperty,
} = {}) {
  return {
    getCdpRuntimeSerializationObserved: () => cdpRuntimeSerializationObserved,
    getUserAgent: () => userAgent,
    getNavigatorWebdriver: () => webdriver,
    getLatestPointerObservation: () => pointerObservation,
    hasWindowProperty: (name) => name === windowProperty,
    hasElement: (candidate) => candidate === selector,
    subscribeToDocumentChanges: () => undefined,
    subscribeToPointerEvents: () => undefined,
    subscribeToCdpRuntimeSerializationChanges: () => undefined,
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

test("reports zero-pressure active mouse input as informational evidence", () => {
  const observation = cdpZeroMousePressureProbe.inspect(
    createEnvironment({
      pointerObservation: {
        buttons: 1,
        isTrusted: true,
        pointerType: "mouse",
        pressure: 0,
      },
    }),
  );

  assert.equal(observation.status, "detected");
  assert.equal(cdpZeroMousePressureProbe.proves, "nothing");
  assert.deepEqual(observation.evidence, {
    buttons: 1,
    isTrusted: true,
    pointerType: "mouse",
    pressure: 0,
  });
});

test("does not report normal mouse pressure or inactive pointer input", () => {
  const normalPressure = cdpZeroMousePressureProbe.inspect(
    createEnvironment({
      pointerObservation: {
        buttons: 1,
        isTrusted: true,
        pointerType: "mouse",
        pressure: 0.5,
      },
    }),
  );
  const inactivePointer = cdpZeroMousePressureProbe.inspect(
    createEnvironment({
      pointerObservation: {
        buttons: 0,
        isTrusted: true,
        pointerType: "mouse",
        pressure: 0,
      },
    }),
  );

  assert.equal(normalPressure.status, "not_detected");
  assert.equal(inactivePointer.status, "not_detected");
});

test("reports a CDP Runtime serialization observer without attributing its operator", () => {
  const observation = cdpRuntimeSerializationObserverProbe.inspect(
    createEnvironment({ cdpRuntimeSerializationObserved: true }),
  );

  assert.equal(observation.status, "detected");
  assert.equal(cdpRuntimeSerializationObserverProbe.proves, "nothing");
  assert.deepEqual(observation.evidence, {
    interpretation: "CDP/DevTools observer detected; operator unknown.",
    serializationObserved: true,
  });
});

test("does not report an unobserved CDP Runtime serialization side effect", () => {
  const observation = cdpRuntimeSerializationObserverProbe.inspect(
    createEnvironment(),
  );

  assert.equal(observation.status, "not_detected");
  assert.deepEqual(observation.evidence, { serializationObserved: false });
});

test("detects the cooperative WebMCP handshake as agentic use", () => {
  const observation = inspectWithSelector(
    cooperativeWebMcpHandshakeProbe,
    "#agentic-use-detection-webmcp-handshake",
  );

  assert.equal(observation.status, "detected");
  assert.equal(cooperativeWebMcpHandshakeProbe.proves, "agentic_use");
});

test("detects the Chrome DevTools third-party bridge separately from WebMCP", () => {
  const observation = chromeDevToolsThirdPartyBridgeProbe.inspect(
    createEnvironment({ windowProperty: "__dtmcp" }),
  );

  assert.equal(observation.status, "detected");
  assert.equal(chromeDevToolsThirdPartyBridgeProbe.proves, "agentic_use");
});
