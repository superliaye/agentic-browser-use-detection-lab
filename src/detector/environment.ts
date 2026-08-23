import type { DetectionEnvironment, PointerObservation } from "./types.js";

export function createBrowserDetectionEnvironment(): DetectionEnvironment {
  let cdpRuntimeSerializationObserved = false;
  let latestPointerObservation: PointerObservation | undefined;

  return {
    getCdpRuntimeSerializationObserved(): boolean {
      return cdpRuntimeSerializationObserved;
    },

    getUserAgent(): string | undefined {
      return typeof navigator.userAgent === "string"
        ? navigator.userAgent
        : undefined;
    },

    getNavigatorWebdriver(): boolean | undefined {
      return typeof navigator.webdriver === "boolean" ? navigator.webdriver : undefined;
    },

    getLatestPointerObservation(): PointerObservation | undefined {
      return latestPointerObservation;
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
      const handleThirdPartyToolDiscovery = (): void => {
        queueMicrotask(listener);
      };
      observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      window.addEventListener("devtoolstooldiscovery", handleThirdPartyToolDiscovery);

      return () => {
        observer.disconnect();
        window.removeEventListener("devtoolstooldiscovery", handleThirdPartyToolDiscovery);
      };
    },

    subscribeToPointerEvents(listener: () => void): () => void {
      const handlePointerDown = (event: PointerEvent): void => {
        latestPointerObservation = {
          buttons: event.buttons,
          isTrusted: event.isTrusted,
          pointerType: event.pointerType,
          pressure: event.pressure,
        };
        listener();
      };

      window.addEventListener("pointerdown", handlePointerDown, true);
      return () => {
        window.removeEventListener("pointerdown", handlePointerDown, true);
      };
    },

    subscribeToCdpRuntimeSerializationChanges(listener: () => void): () => void {
      let isActive = true;
      const serializationTarget = function cdpRuntimeSerializationTarget(): void {};

      Object.defineProperty(serializationTarget, "toString", {
        value(): string {
          if (isActive && !cdpRuntimeSerializationObserved) {
            cdpRuntimeSerializationObserved = true;
            queueMicrotask(listener);
          }

          return "function cdpRuntimeSerializationTarget() {}";
        },
      });
      console.debug(serializationTarget);

      return () => {
        isActive = false;
      };
    },
  };
}
