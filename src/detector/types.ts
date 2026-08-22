export type DetectionSignalStatus =
  | "detected"
  | "not_detected"
  | "unsupported"
  | "error";

export type DetectionConclusion = "agentic_use" | "automation" | "nothing";

export type DetectionEvidenceValue = string | number | boolean;

export interface DetectionProbeObservation {
  readonly status: DetectionSignalStatus;
  readonly evidence: Readonly<Record<string, DetectionEvidenceValue>>;
}

export interface DetectionEnvironment {
  getNavigatorWebdriver(): boolean | undefined;
  hasWindowProperty(name: string): boolean;
  hasElement(selector: string): boolean;
  subscribeToDocumentChanges(listener: () => void): (() => void) | undefined;
}

export interface DetectionProbe {
  readonly id: string;
  readonly area: string;
  readonly proves: DetectionConclusion;
  inspect(environment: DetectionEnvironment): DetectionProbeObservation;
}

export interface DetectionSignal {
  readonly id: string;
  readonly area: string;
  readonly status: DetectionSignalStatus;
  readonly proves: DetectionConclusion;
  readonly evidence: Readonly<Record<string, DetectionEvidenceValue>>;
}

export interface DetectionResult {
  readonly isAgenticUseDetected: boolean;
  readonly isGenericAutomationDetected: boolean;
  readonly signals: readonly DetectionSignal[];
}

export type DetectionResultListener = (result: DetectionResult) => void;

export interface AgenticUseDetector {
  start(): void;
  stop(): void;
  getResult(): DetectionResult;
  subscribe(listener: DetectionResultListener): () => void;
}
