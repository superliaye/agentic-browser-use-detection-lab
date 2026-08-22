import type { DetectionProbe } from "../types.js";

export const webdriverProbe: DetectionProbe = {
  id: "navigator-webdriver",
  area: "browser_runtime",
  proves: "automation",
  inspect(environment) {
    const webdriver = environment.getNavigatorWebdriver();

    if (webdriver === undefined) {
      return {
        status: "unsupported",
        evidence: { webdriverAvailable: false },
      };
    }

    return {
      status: webdriver ? "detected" : "not_detected",
      evidence: { webdriver },
    };
  },
};
