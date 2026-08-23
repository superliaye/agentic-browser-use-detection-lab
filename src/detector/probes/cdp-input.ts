import type { DetectionProbe } from "../types.js";

export const cdpZeroMousePressureProbe: DetectionProbe = {
  id: "cdp-zero-mouse-pressure",
  area: "pointer_input",
  proves: "nothing",
  inspect(environment) {
    const observation = environment.getLatestPointerObservation();

    if (observation === undefined) {
      return {
        status: "not_detected",
        evidence: { pointerObserved: false },
      };
    }

    const detected =
      observation.isTrusted &&
      observation.pointerType === "mouse" &&
      observation.buttons > 0 &&
      observation.pressure === 0;

    return {
      status: detected ? "detected" : "not_detected",
      evidence: {
        buttons: observation.buttons,
        isTrusted: observation.isTrusted,
        pointerType: observation.pointerType,
        pressure: observation.pressure,
      },
    };
  },
};
