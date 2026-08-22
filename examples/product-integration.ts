import {
  createAgenticUseDetector,
  defaultProbes,
  type DetectionResult,
} from "../src/detector/index.js";

export function monitorAgenticBrowserUse(
  handleResult: (result: DetectionResult) => void,
): () => void {
  const detector = createAgenticUseDetector(defaultProbes);
  const unsubscribe = detector.subscribe(handleResult);
  detector.start();
  handleResult(detector.getResult());

  return () => {
    unsubscribe();
    detector.stop();
  };
}
