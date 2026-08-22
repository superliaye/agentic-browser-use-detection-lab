import type { DetectionProbe } from "../types.js";

const CLAUDE_USER_AGENT_PATTERN = /\bClaude\/([^\s;()]+)/;
const ELECTRON_USER_AGENT_PATTERN = /\bElectron\/([^\s;()]+)/;
const CLAUDE_ELEMENT_MAP = "__claudeElementMap";
const CLAUDE_ELEMENT_REVERSE_MAP = "__claudeElementReverseMap";
const CLAUDE_REF_COUNTER = "__claudeRefCounter";

function createUserAgentProbe(
  id: string,
  proves: DetectionProbe["proves"],
  versionName: string,
  pattern: RegExp,
): DetectionProbe {
  return {
    id,
    area: "browser_user_agent",
    proves,
    inspect(environment) {
      const userAgent = environment.getUserAgent();

      if (userAgent === undefined) {
        return {
          status: "unsupported",
          evidence: { userAgentAvailable: false },
        };
      }

      const match = pattern.exec(userAgent);
      return {
        status: match === null ? "not_detected" : "detected",
        evidence: {
          userAgent,
          [versionName]: match?.[1] ?? "",
        },
      };
    },
  };
}

export const claudeDesktopBrowserUserAgentProbe = createUserAgentProbe(
  "claude-desktop-browser-user-agent",
  "agentic_use",
  "claudeVersion",
  CLAUDE_USER_AGENT_PATTERN,
);

export const electronUserAgentProbe = createUserAgentProbe(
  "electron-user-agent",
  "nothing",
  "electronVersion",
  ELECTRON_USER_AGENT_PATTERN,
);

export const claudeRefTrackingGlobalsProbe: DetectionProbe = {
  id: "claude-ref-tracking-globals",
  area: "agent_instrumentation",
  proves: "agentic_use",
  inspect(environment) {
    const elementMapPresent = environment.hasWindowProperty(CLAUDE_ELEMENT_MAP);
    const elementReverseMapPresent = environment.hasWindowProperty(
      CLAUDE_ELEMENT_REVERSE_MAP,
    );
    const refCounterPresent = environment.hasWindowProperty(CLAUDE_REF_COUNTER);

    return {
      status: elementMapPresent && refCounterPresent ? "detected" : "not_detected",
      evidence: {
        [CLAUDE_ELEMENT_MAP]: elementMapPresent,
        [CLAUDE_ELEMENT_REVERSE_MAP]: elementReverseMapPresent,
        [CLAUDE_REF_COUNTER]: refCounterPresent,
      },
    };
  },
};
