import type { DetectionProbe } from "../types.js";
import { claudeActiveControlProbe, claudePriorControlProbe } from "./claude-browser.js";
import { playwrightWindowGlobalsProbe } from "./playwright.js";
import { webdriverProbe } from "./webdriver.js";

export { claudeActiveControlProbe, claudePriorControlProbe } from "./claude-browser.js";
export { playwrightWindowGlobalsProbe } from "./playwright.js";
export { webdriverProbe } from "./webdriver.js";

export const defaultProbes: readonly DetectionProbe[] = Object.freeze([
  claudeActiveControlProbe,
  claudePriorControlProbe,
  webdriverProbe,
  playwrightWindowGlobalsProbe,
]);
