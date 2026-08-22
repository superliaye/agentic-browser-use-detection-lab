import type { DetectionProbe } from "../types.js";

const CODEX_EXTENSION_AGENT_OVERLAY_SELECTOR =
  '#codex-agent-overlay-root[data-codex-agent-overlay-root="true"]';

// The extension creates this root after linking the page to an agent session.
export const codexExtensionAgentOverlayProbe: DetectionProbe = {
  id: "codex-extension-agent-overlay-root",
  area: "product_dom",
  proves: "agentic_use",
  inspect(environment) {
    const present = environment.hasElement(
      CODEX_EXTENSION_AGENT_OVERLAY_SELECTOR,
    );
    return {
      status: present ? "detected" : "not_detected",
      evidence: {
        selector: CODEX_EXTENSION_AGENT_OVERLAY_SELECTOR,
        present,
      },
    };
  },
};
