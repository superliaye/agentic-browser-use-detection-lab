import type { DetectionProbe } from "../types.js";

export const cdpRuntimeSerializationObserverProbe: DetectionProbe = {
  id: "cdp-runtime-serialization-observer",
  area: "browser_runtime",
  proves: "nothing",
  inspect(environment) {
    const serializationObserved = environment.getCdpRuntimeSerializationObserved();

    return {
      status: serializationObserved ? "detected" : "not_detected",
      evidence: serializationObserved
        ? {
            interpretation: "CDP/DevTools observer detected; operator unknown.",
            serializationObserved,
          }
        : { serializationObserved },
    };
  },
};
