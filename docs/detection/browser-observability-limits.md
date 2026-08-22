# Browser observability limits

A page can inspect its DOM, JavaScript globals, Web APIs, and the events delivered to it. It generally cannot attribute a valid click to a person, an extension, CDP, an accessibility controller, or native desktop input when those paths leave no extra page-visible artifact.

Consequences:

- A counter change proves the interaction happened, not who caused it.
- Native or trusted input may look like ordinary input to the page.
- CDP use is not itself a stable page-visible fact.
- Browser-visible markers can change, disappear, or be forged.
- A product-specific marker can prove use when present without covering every version or flow.
- A negative result never proves a human user.

The lab excludes the classic CDP `Error.stack` getter technique. V8 changes in May 2025 stopped DevTools error previews from invoking user-defined getters, so the signal now fails silently in modern Chromium.

The lab also avoids behavioral scoring. Products can combine these deterministic facts with their own server-side, policy, or risk systems, but that is outside this library's contract.

Source: [Castle — Why a classic CDP bot detection signal suddenly stopped working](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/), inspected 2026-08-22.
