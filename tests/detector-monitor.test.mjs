import assert from "node:assert/strict";
import test from "node:test";

import {
  createAgenticUseDetector,
  defaultProbes,
} from "../.test-dist/src/detector/index.js";

function createEnvironment() {
  let documentChangeListener;
  let disposerCount = 0;

  return {
    environment: {
      getNavigatorWebdriver: () => false,
      hasWindowProperty: () => false,
      hasElement: () => false,
      subscribeToDocumentChanges: (listener) => {
        documentChangeListener = listener;
        return () => {
          disposerCount += 1;
        };
      },
    },
    triggerDocumentChange: () => documentChangeListener?.(),
    getDisposerCount: () => disposerCount,
  };
}

function runAgenticTransition() {
  let agenticDetected = false;
  let automationDetected = false;
  const { environment, triggerDocumentChange } = createEnvironment();
  const probes = [
    {
      id: "agentic",
      area: "product_dom",
      proves: "agentic_use",
      inspect: () => ({
        status: agenticDetected ? "detected" : "not_detected",
        evidence: { agenticDetected },
      }),
    },
    {
      id: "automation",
      area: "browser_runtime",
      proves: "automation",
      inspect: () => ({
        status: automationDetected ? "detected" : "not_detected",
        evidence: { automationDetected },
      }),
    },
  ];
  const detector = createAgenticUseDetector(probes, environment);

  detector.start();
  agenticDetected = true;
  automationDetected = true;
  triggerDocumentChange();
  agenticDetected = false;
  automationDetected = false;
  triggerDocumentChange();

  return detector.getResult();
}

function runThrowingProbeBesideWebdriverProbe() {
  const { environment } = createEnvironment();
  const probes = [
    {
      id: "throwing",
      area: "test",
      proves: "agentic_use",
      inspect: () => {
        throw new Error("sensitive implementation detail");
      },
    },
    {
      id: "webdriver",
      area: "browser_runtime",
      proves: "automation",
      inspect: () => ({ status: "detected", evidence: { webdriver: true } }),
    },
  ];
  const detector = createAgenticUseDetector(probes, environment);

  detector.start();
  return detector.getResult();
}

function runCodexBuiltInBrowserDetection() {
  const { environment } = createEnvironment();
  environment.hasElement = (selector) =>
    selector === "#codex-browser-sidebar-comments-root";
  const detector = createAgenticUseDetector(defaultProbes, environment);

  detector.start();
  return detector.getResult();
}

function runStoppedDetectorTransition() {
  const { environment, triggerDocumentChange, getDisposerCount } = createEnvironment();
  const detector = createAgenticUseDetector(
    [
      {
        id: "stable",
        area: "test",
        proves: "nothing",
        inspect: () => ({ status: "not_detected", evidence: {} }),
      },
    ],
    environment,
  );
  let callbackCount = 0;
  detector.subscribe(() => {
    callbackCount += 1;
  });

  detector.start();
  detector.stop();
  triggerDocumentChange();

  return { callbackCount, disposerCount: getDisposerCount() };
}

function runInitialSnapshot() {
  const { environment } = createEnvironment();
  const detector = createAgenticUseDetector(
    [
      {
        id: "snapshot",
        area: "test",
        proves: "nothing",
        inspect: () => ({ status: "not_detected", evidence: { present: false } }),
      },
    ],
    environment,
  );

  detector.start();
  return detector.getResult();
}

test("latches agentic and generic automation detection", () => {
  const result = runAgenticTransition();

  assert.equal(result.isAgenticUseDetected, true);
  assert.equal(result.isGenericAutomationDetected, true);
});

test("detects the Codex built-in Browser marker as agentic use only", () => {
  const result = runCodexBuiltInBrowserDetection();

  assert.equal(result.isAgenticUseDetected, true);
  assert.equal(result.isGenericAutomationDetected, false);
});

test("reports probe failures without stopping sibling probes", () => {
  const result = runThrowingProbeBesideWebdriverProbe();

  assert.equal(result.signals.find(({ id }) => id === "throwing")?.status, "error");
  assert.equal(result.isGenericAutomationDetected, true);
});

test("stops environment observation and later callbacks", () => {
  const { callbackCount, disposerCount } = runStoppedDetectorTransition();

  assert.equal(callbackCount, 1);
  assert.equal(disposerCount, 1);
});

test("returns frozen result snapshots", () => {
  const result = runInitialSnapshot();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.signals), true);
  assert.equal(Object.isFrozen(result.signals[0]), true);
  assert.equal(Object.isFrozen(result.signals[0].evidence), true);
});
