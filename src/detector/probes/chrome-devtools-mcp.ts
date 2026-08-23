import type { DetectionProbe } from "../types.js";

const WEB_MCP_HANDSHAKE_SELECTOR = "#agentic-use-detection-webmcp-handshake";

export const cooperativeWebMcpHandshakeProbe: DetectionProbe = {
  id: "cooperative-webmcp-handshake",
  area: "cooperative_tooling",
  proves: "agentic_use",
  inspect(environment) {
    const present = environment.hasElement(WEB_MCP_HANDSHAKE_SELECTOR);
    return {
      status: present ? "detected" : "not_detected",
      evidence: { present, selector: WEB_MCP_HANDSHAKE_SELECTOR },
    };
  },
};

export const chromeDevToolsThirdPartyBridgeProbe: DetectionProbe = {
  id: "chrome-devtools-third-party-bridge",
  area: "page_globals",
  proves: "agentic_use",
  inspect(environment) {
    const present = environment.hasWindowProperty("__dtmcp");
    return {
      status: present ? "detected" : "not_detected",
      evidence: { global: "__dtmcp", present },
    };
  },
};
