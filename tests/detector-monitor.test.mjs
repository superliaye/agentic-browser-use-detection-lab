import assert from "node:assert/strict";
import test from "node:test";

import {
  createAgenticUseDetector,
  defaultProbes,
} from "../.test-dist/src/detector/index.js";

function createEnvironment({ userAgent, windowProperties = [] } = {}) {
  let documentChangeListener;
  let latestPointerObservation;
  let pointerEventListener;
  let disposerCount = 0;
  const windowPropertySet = new Set(windowProperties);

  return {
    environment: {
      getUserAgent: () => userAgent,
      getNavigatorWebdriver: () => false,
      getLatestPointerObservation: () => latestPointerObservation,
      hasWindowProperty: (name) => windowPropertySet.has(name),
      hasElement: () => false,
      subscribeToDocumentChanges: (listener) => {
        documentChangeListener = listener;
        return () => {
          disposerCount += 1;
        };
      },
      subscribeToPointerEvents: (listener) => {
        pointerEventListener = listener;
        return () => {
          disposerCount += 1;
        };
      },
    },
    triggerDocumentChange: () => documentChangeListener?.(),
    triggerPointerEvent: (observation) => {
      latestPointerObservation = observation;
      pointerEventListener?.();
    },
    getDisposerCount: () => disposerCount,
  };
}

function runDefaultDetection(environmentOptions) {
  const { environment } = createEnvironment(environmentOptions);
  const detector = createAgenticUseDetector(defaultProbes, environment);

  detector.start();
  return detector.getResult();
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
  const initialResult = detector.getResult();
  agenticDetected = true;
  automationDetected = true;
  triggerDocumentChange();
  const detectedResult = detector.getResult();
  agenticDetected = false;
  automationDetected = false;
  triggerDocumentChange();

  return {
    detectedResult,
    initialResult,
    previousDetectionResult: detector.getResult(),
  };
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
  const {
    environment,
    triggerDocumentChange,
    triggerPointerEvent,
    getDisposerCount,
  } = createEnvironment();
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
  triggerPointerEvent({
    buttons: 1,
    isTrusted: true,
    pointerType: "mouse",
    pressure: 0,
  });

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
  const { previousDetectionResult } = runAgenticTransition();

  assert.equal(previousDetectionResult.isAgenticUseDetected, true);
  assert.equal(previousDetectionResult.isGenericAutomationDetected, true);
});

test("distinguishes current detection from earlier detection in the session", () => {
  const { detectedResult, initialResult, previousDetectionResult } =
    runAgenticTransition();
  const findAgenticSignal = (result) =>
    result.signals.find(({ id }) => id === "agentic");

  assert.equal(findAgenticSignal(initialResult)?.status, "not_detected");
  assert.equal(findAgenticSignal(detectedResult)?.status, "detected_now");
  assert.equal(
    findAgenticSignal(previousDetectionResult)?.status,
    "detected_earlier_in_session",
  );
});

test("detects the ChatGPT Desktop Codex Browser marker as agentic use only", () => {
  const result = runCodexBuiltInBrowserDetection();

  assert.equal(result.isAgenticUseDetected, true);
  assert.equal(result.isGenericAutomationDetected, false);
});

test("detects the Claude Desktop Browser user agent as agentic use", () => {
  const result = runDefaultDetection({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)Claude/1.34493.1 Chrome/148.0.7778.280 Electron/42.9.2 Safari/537.36 MSIX",
  });

  assert.equal(result.isAgenticUseDetected, true);
  assert.equal(result.isGenericAutomationDetected, false);
  assert.equal(
    result.signals.find(({ id }) => id === "claude-desktop-browser-user-agent")
      ?.status,
    "detected_now",
  );
});

test("detects Claude ref-tracking globals as agentic use", () => {
  const result = runDefaultDetection({
    windowProperties: [
      "__claudeElementMap",
      "__claudeElementReverseMap",
      "__claudeRefCounter",
    ],
  });

  assert.equal(result.isAgenticUseDetected, true);
  assert.equal(result.isGenericAutomationDetected, false);
  assert.equal(
    result.signals.find(({ id }) => id === "claude-ref-tracking-globals")?.status,
    "detected_now",
  );
});

test("reports Electron without treating it as agentic use or automation", () => {
  const result = runDefaultDetection({
    userAgent: "Mozilla/5.0 Chrome/148.0.7778.280 Electron/42.9.2 Safari/537.36",
  });
  const signal = result.signals.find(({ id }) => id === "electron-user-agent");

  assert.equal(result.isAgenticUseDetected, false);
  assert.equal(result.isGenericAutomationDetected, false);
  assert.equal(signal?.status, "detected_now");
  assert.equal(signal?.proves, "nothing");
});

test("reports probe failures without stopping sibling probes", () => {
  const result = runThrowingProbeBesideWebdriverProbe();

  assert.equal(result.signals.find(({ id }) => id === "throwing")?.status, "error");
  assert.equal(result.isGenericAutomationDetected, true);
});

test("stops environment observation and later callbacks", () => {
  const { callbackCount, disposerCount } = runStoppedDetectorTransition();

  assert.equal(callbackCount, 1);
  assert.equal(disposerCount, 2);
});

test("keeps zero-pressure mouse evidence out of both aggregate verdicts", () => {
  const { environment, triggerPointerEvent } = createEnvironment();
  const detector = createAgenticUseDetector(defaultProbes, environment);

  detector.start();
  triggerPointerEvent({
    buttons: 1,
    isTrusted: true,
    pointerType: "mouse",
    pressure: 0,
  });
  const result = detector.getResult();
  const signal = result.signals.find(({ id }) => id === "cdp-zero-mouse-pressure");

  assert.equal(signal?.status, "detected_now");
  assert.equal(signal?.proves, "nothing");
  assert.equal(result.isAgenticUseDetected, false);
  assert.equal(result.isGenericAutomationDetected, false);
});

test("returns frozen result snapshots", () => {
  const result = runInitialSnapshot();

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.signals), true);
  assert.equal(Object.isFrozen(result.signals[0]), true);
  assert.equal(Object.isFrozen(result.signals[0].evidence), true);
});
