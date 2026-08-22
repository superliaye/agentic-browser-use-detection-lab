import { createBrowserDetectionEnvironment } from "./environment.js";
import type {
  AgenticUseDetector,
  DetectionEnvironment,
  DetectionProbe,
  DetectionResult,
  DetectionResultListener,
  DetectionSignal,
} from "./types.js";

function freezeSignal(signal: DetectionSignal): DetectionSignal {
  return Object.freeze({
    ...signal,
    evidence: Object.freeze({ ...signal.evidence }),
  });
}

function freezeResult(result: DetectionResult): DetectionResult {
  return Object.freeze({
    ...result,
    signals: Object.freeze(result.signals.map(freezeSignal)),
  });
}

const INITIAL_RESULT = freezeResult({
  isAgenticUseDetected: false,
  isAutomationDetected: false,
  signals: [],
});

function inspectProbe(probe: DetectionProbe, environment: DetectionEnvironment): DetectionSignal {
  try {
    const observation = probe.inspect(environment);
    return {
      id: probe.id,
      area: probe.area,
      status: observation.status,
      proves: probe.proves,
      evidence: observation.evidence,
    };
  } catch {
    return {
      id: probe.id,
      area: probe.area,
      status: "error",
      proves: probe.proves,
      evidence: { error: "Probe inspection failed" },
    };
  }
}

export function createAgenticUseDetector(
  probes: readonly DetectionProbe[],
  environment: DetectionEnvironment = createBrowserDetectionEnvironment(),
): AgenticUseDetector {
  const listeners = new Set<DetectionResultListener>();
  let currentResult = INITIAL_RESULT;
  let currentResultKey = JSON.stringify(currentResult);
  let isStarted = false;
  let isStopped = false;
  let disposeDocumentObservation: (() => void) | undefined;

  const inspectAndPublish = (): void => {
    if (isStopped) {
      return;
    }

    const signals = probes.map((probe) => inspectProbe(probe, environment));
    const agenticUseObserved = signals.some(
      (signal) => signal.status === "detected" && signal.proves === "agentic_use",
    );
    const automationObserved = signals.some(
      (signal) =>
        signal.status === "detected" &&
        (signal.proves === "agentic_use" || signal.proves === "automation"),
    );
    const nextResult = freezeResult({
      isAgenticUseDetected: currentResult.isAgenticUseDetected || agenticUseObserved,
      isAutomationDetected: currentResult.isAutomationDetected || automationObserved,
      signals,
    });
    const nextResultKey = JSON.stringify(nextResult);

    if (nextResultKey === currentResultKey) {
      return;
    }

    currentResult = nextResult;
    currentResultKey = nextResultKey;
    for (const listener of listeners) {
      listener(currentResult);
    }
  };

  return {
    start(): void {
      if (isStarted || isStopped) {
        return;
      }

      isStarted = true;
      inspectAndPublish();
      disposeDocumentObservation = environment.subscribeToDocumentChanges(inspectAndPublish);
    },

    stop(): void {
      if (isStopped) {
        return;
      }

      isStopped = true;
      disposeDocumentObservation?.();
      disposeDocumentObservation = undefined;
      listeners.clear();
    },

    getResult(): DetectionResult {
      return currentResult;
    },

    subscribe(listener: DetectionResultListener): () => void {
      if (!isStopped) {
        listeners.add(listener);
      }

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
