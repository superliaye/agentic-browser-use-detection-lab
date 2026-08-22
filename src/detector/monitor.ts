import { createBrowserDetectionEnvironment } from "./environment.js";
import type {
  AgenticUseDetector,
  DetectionEnvironment,
  DetectionProbe,
  DetectionProbeObservationStatus,
  DetectionResult,
  DetectionResultListener,
  DetectionSignal,
} from "./types.js";

interface ProbeInspection {
  readonly id: string;
  readonly area: string;
  readonly status: DetectionProbeObservationStatus;
  readonly proves: DetectionSignal["proves"];
  readonly evidence: DetectionSignal["evidence"];
}

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
  isGenericAutomationDetected: false,
  signals: [],
});

function inspectProbe(probe: DetectionProbe, environment: DetectionEnvironment): ProbeInspection {
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
  const detectedSignalIds = new Set<string>();
  let currentResult = INITIAL_RESULT;
  let currentResultKey = JSON.stringify(currentResult);
  let isStarted = false;
  let isStopped = false;
  let disposeDocumentObservation: (() => void) | undefined;

  const inspectAndPublish = (): void => {
    if (isStopped) {
      return;
    }

    const signals = probes.map((probe): DetectionSignal => {
      const inspection = inspectProbe(probe, environment);

      if (inspection.status === "detected") {
        detectedSignalIds.add(inspection.id);
      }

      const status =
        inspection.status === "detected"
          ? "detected_now"
          : inspection.status === "not_detected" && detectedSignalIds.has(inspection.id)
            ? "detected_earlier_in_session"
            : inspection.status;

      return {
        ...inspection,
        status,
      };
    });
    const agenticUseObserved = signals.some(
      (signal) => signal.status === "detected_now" && signal.proves === "agentic_use",
    );
    const genericAutomationObserved = signals.some(
      (signal) => signal.status === "detected_now" && signal.proves === "automation",
    );
    const nextResult = freezeResult({
      isAgenticUseDetected: currentResult.isAgenticUseDetected || agenticUseObserved,
      isGenericAutomationDetected:
        currentResult.isGenericAutomationDetected || genericAutomationObserved,
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
