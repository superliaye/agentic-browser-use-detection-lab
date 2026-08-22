import type { DetectionEnvironment } from "./types.js";

export function createBrowserDetectionEnvironment(): DetectionEnvironment {
  return {
    getNavigatorWebdriver(): boolean | undefined {
      return typeof navigator.webdriver === "boolean" ? navigator.webdriver : undefined;
    },

    hasWindowProperty(name: string): boolean {
      return name in window;
    },

    hasElement(selector: string): boolean {
      return document.querySelector(selector) !== null;
    },

    subscribeToDocumentChanges(listener: () => void): (() => void) | undefined {
      if (document.documentElement === null || typeof MutationObserver === "undefined") {
        return undefined;
      }

      const observer = new MutationObserver(listener);
      observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    },
  };
}
