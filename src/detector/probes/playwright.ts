import type { DetectionProbe } from "../types.js";

const PLAYWRIGHT_BINDING = "__playwright__binding__";
const PLAYWRIGHT_INIT_SCRIPTS = "__pwInitScripts";

export const playwrightWindowGlobalsProbe: DetectionProbe = {
  id: "playwright-window-globals",
  area: "browser_runtime",
  proves: "automation",
  inspect(environment) {
    const bindingPresent = environment.hasWindowProperty(PLAYWRIGHT_BINDING);
    const initScriptsPresent = environment.hasWindowProperty(PLAYWRIGHT_INIT_SCRIPTS);

    return {
      status: bindingPresent || initScriptsPresent ? "detected" : "not_detected",
      evidence: {
        [PLAYWRIGHT_BINDING]: bindingPresent,
        [PLAYWRIGHT_INIT_SCRIPTS]: initScriptsPresent,
      },
    };
  },
};
