import type { DetectionProbe } from "../types.js";
import { claudeActiveControlProbe, claudePriorControlProbe } from "./claude-browser.js";
import {
  claudeDesktopBrowserUserAgentProbe,
  claudeRefTrackingGlobalsProbe,
  electronUserAgentProbe,
} from "./claude-desktop-browser.js";
import { codexBuiltInBrowserProbe } from "./codex-browser.js";
import { codexExtensionAgentOverlayProbe } from "./codex-chrome-extension.js";
import { cdpZeroMousePressureProbe } from "./cdp-input.js";
import {
  chromeDevToolsThirdPartyBridgeProbe,
  cooperativeWebMcpHandshakeProbe,
} from "./chrome-devtools-mcp.js";
import { playwrightWindowGlobalsProbe } from "./playwright.js";
import { webdriverProbe } from "./webdriver.js";

export { claudeActiveControlProbe, claudePriorControlProbe } from "./claude-browser.js";
export {
  claudeDesktopBrowserUserAgentProbe,
  claudeRefTrackingGlobalsProbe,
  electronUserAgentProbe,
} from "./claude-desktop-browser.js";
export { codexBuiltInBrowserProbe } from "./codex-browser.js";
export { codexExtensionAgentOverlayProbe } from "./codex-chrome-extension.js";
export { cdpZeroMousePressureProbe } from "./cdp-input.js";
export {
  chromeDevToolsThirdPartyBridgeProbe,
  cooperativeWebMcpHandshakeProbe,
} from "./chrome-devtools-mcp.js";
export { playwrightWindowGlobalsProbe } from "./playwright.js";
export { webdriverProbe } from "./webdriver.js";

export const defaultProbes: readonly DetectionProbe[] = Object.freeze([
  claudeActiveControlProbe,
  claudePriorControlProbe,
  claudeDesktopBrowserUserAgentProbe,
  claudeRefTrackingGlobalsProbe,
  electronUserAgentProbe,
  codexBuiltInBrowserProbe,
  codexExtensionAgentOverlayProbe,
  cooperativeWebMcpHandshakeProbe,
  chromeDevToolsThirdPartyBridgeProbe,
  webdriverProbe,
  playwrightWindowGlobalsProbe,
  cdpZeroMousePressureProbe,
]);
