import type { DetectionProbe } from "../types.js";

const CODEX_BROWSER_CONTEXT_SELECTOR = "#codex-browser-sidebar-comments-root";

// This product-owned root identifies a page loaded in a ChatGPT Desktop Codex Browser.
export const codexBuiltInBrowserProbe: DetectionProbe = {
  id: "codex-built-in-browser-context",
  area: "product_dom",
  proves: "agentic_use",
  inspect(environment) {
    const present = environment.hasElement(CODEX_BROWSER_CONTEXT_SELECTOR);
    return {
      status: present ? "detected" : "not_detected",
      evidence: {
        selector: CODEX_BROWSER_CONTEXT_SELECTOR,
        present,
      },
    };
  },
};
