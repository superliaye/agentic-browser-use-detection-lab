import type { DetectionProbe } from "../types.js";

const ACTIVE_CONTROL_SELECTOR = "#claude-agent-stop-container";
const PRIOR_CONTROL_SELECTOR = "#claude-agent-animation-styles";

function createClaudeElementProbe(
  id: string,
  selector: string,
): DetectionProbe {
  return {
    id,
    area: "product_dom",
    proves: "agentic_use",
    inspect(environment) {
      const present = environment.hasElement(selector);
      return {
        status: present ? "detected" : "not_detected",
        evidence: { selector, present },
      };
    },
  };
}

// These page markers are product-specific artifacts reported during Claude's
// active browser control, not a supported Anthropic detection API.
export const claudeActiveControlProbe = createClaudeElementProbe(
  "claude-active-control-container",
  ACTIVE_CONTROL_SELECTOR,
);

export const claudePriorControlProbe = createClaudeElementProbe(
  "claude-prior-control-animation-styles",
  PRIOR_CONTROL_SELECTOR,
);
