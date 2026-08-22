import {
  createAgenticUseDetector,
  defaultProbes,
  type DetectionResult,
} from "../detector/index.js";
import {
  AGENTIC_APPROACHES,
  getModeInstructions,
  type AgenticApproach,
  type EntryMode,
} from "./approaches.js";
import { buildLaunchUrl, buildTestPrompt } from "./prompts.js";
import "./styles.css";

const REPOSITORY_URL = "https://github.com/superliaye/agentic-browser-use-detection-lab";

const app = document.querySelector<HTMLElement>("#app");

if (app === null) {
  throw new Error("Missing #app root element");
}

app.innerHTML = `
  <div class="page-shell">
    <header class="hero">
      <nav class="topbar" aria-label="Project links">
        <a class="wordmark" href="${REPOSITORY_URL}">Agentic browser lab</a>
        <a class="source-link" href="${REPOSITORY_URL}">View source <span aria-hidden="true">↗</span></a>
      </nav>
      <div class="hero-copy">
        <p class="eyebrow">Browser-visible evidence, inspected live</p>
        <h1>Can this page tell when an agent is driving?</h1>
        <p class="lede">Choose a Claude or Codex approach, hand it one precise task, and watch the browser-visible signals. A clean result means <em>not detected</em>—never “human.”</p>
      </div>
    </header>

    <main>
      <section class="verdict-grid" aria-label="Current detection result">
        <article class="verdict-card" id="agentic-verdict-card">
          <div class="verdict-heading">
            <span class="verdict-index">01</span>
            <span class="status-pill" id="agentic-verdict-value">Not detected</span>
          </div>
          <h2>Agentic use</h2>
          <p id="agentic-verdict-detail">No deterministic agent-specific signal observed.</p>
        </article>
        <article class="verdict-card" id="generic-automation-verdict-card">
          <div class="verdict-heading">
            <span class="verdict-index">02</span>
            <span class="status-pill" id="generic-automation-verdict-value">Not detected</span>
          </div>
          <h2>Generic automation</h2>
          <p id="generic-automation-verdict-detail">No deterministic generic automation signal observed.</p>
        </article>
      </section>

      <div class="workspace-grid">
        <section class="panel guide-panel" aria-labelledby="test-guide-title">
          <div class="section-heading">
            <p class="section-kicker">Configure a run</p>
            <h2 id="test-guide-title">Test guide</h2>
          </div>

          <div class="field-grid">
            <label class="field">
              <span>Agentic approach</span>
              <select id="approach-select"></select>
            </label>
            <label class="field">
              <span>How the agent enters</span>
              <select id="mode-select"></select>
            </label>
          </div>

          <p class="approach-summary" id="approach-summary"></p>
          <p class="expected-signals" id="expected-signals"></p>

          <div class="steps-block">
            <h3>Steps</h3>
            <ol id="test-steps"></ol>
          </div>

          <div class="launch-url-block" id="launch-url-block">
            <span>Generated test URL</span>
            <code id="launch-url"></code>
          </div>

          <label class="prompt-field" for="test-prompt">
            <span>Prompt for the agent</span>
            <textarea id="test-prompt" rows="6" readonly></textarea>
          </label>

          <div class="guide-actions">
            <button class="copy-button" id="copy-prompt" type="button">Copy prompt</button>
            <a id="approach-docs" href="${REPOSITORY_URL}">Read approach notes <span aria-hidden="true">↗</span></a>
          </div>

          <div class="interaction-target">
            <div>
              <p class="section-kicker">Agent interaction target</p>
              <h3>One click, visible result</h3>
              <p>Use the generated prompt. The click proves only that the task happened; detection comes from the signals above.</p>
            </div>
            <div class="counter-control">
              <button id="counter-button" type="button">Increment counter</button>
              <output id="counter-output" for="counter-button" aria-live="polite">Count: 0</output>
            </div>
          </div>
        </section>

        <section class="panel detection-panel" aria-labelledby="signal-title">
          <div class="section-heading detection-heading">
            <div>
              <p class="section-kicker">Raw observations</p>
              <h2 id="signal-title">Detection signals</h2>
            </div>
            <span class="live-indicator"><span aria-hidden="true"></span>Live</span>
          </div>

          <div class="signal-table-wrap">
            <table>
              <caption>Browser-visible detection signal results</caption>
              <thead>
                <tr>
                  <th scope="col">Signal</th>
                  <th scope="col">Status</th>
                  <th scope="col">Conclusion</th>
                  <th scope="col">Evidence</th>
                </tr>
              </thead>
              <tbody id="signal-table-body"></tbody>
            </table>
          </div>

          <details class="json-details" open>
            <summary>Detection contract JSON</summary>
            <pre id="result-json" tabindex="0"></pre>
          </details>
        </section>
      </div>
    </main>

    <footer>
      <p>Deterministic for recorded, non-adversarial tooling—not a universal bot verdict.</p>
      <a href="${REPOSITORY_URL}/blob/main/docs/detection/browser-observability-limits.md">Read the limits</a>
    </footer>
  </div>
`;

function requireElement<ElementType extends Element>(selector: string): ElementType {
  const element = document.querySelector<ElementType>(selector);

  if (element === null) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
}

function isEntryMode(value: string | null): value is EntryMode {
  return value === "launch" || value === "takeover";
}

function createOption(value: string, label: string): HTMLOptionElement {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function createCurrentPageBaseUrl(): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
}

const approachSelect = requireElement<HTMLSelectElement>("#approach-select");
const modeSelect = requireElement<HTMLSelectElement>("#mode-select");
const approachSummary = requireElement<HTMLParagraphElement>("#approach-summary");
const expectedSignals = requireElement<HTMLParagraphElement>("#expected-signals");
const testSteps = requireElement<HTMLOListElement>("#test-steps");
const launchUrlBlock = requireElement<HTMLDivElement>("#launch-url-block");
const launchUrlValue = requireElement<HTMLElement>("#launch-url");
const testPrompt = requireElement<HTMLTextAreaElement>("#test-prompt");
const copyPromptButton = requireElement<HTMLButtonElement>("#copy-prompt");
const approachDocs = requireElement<HTMLAnchorElement>("#approach-docs");
const counterButton = requireElement<HTMLButtonElement>("#counter-button");
const counterOutput = requireElement<HTMLOutputElement>("#counter-output");
const agenticVerdictCard = requireElement<HTMLElement>("#agentic-verdict-card");
const agenticVerdictValue = requireElement<HTMLElement>("#agentic-verdict-value");
const agenticVerdictDetail = requireElement<HTMLParagraphElement>("#agentic-verdict-detail");
const genericAutomationVerdictCard = requireElement<HTMLElement>(
  "#generic-automation-verdict-card",
);
const genericAutomationVerdictValue = requireElement<HTMLElement>(
  "#generic-automation-verdict-value",
);
const genericAutomationVerdictDetail = requireElement<HTMLParagraphElement>(
  "#generic-automation-verdict-detail",
);
const signalTableBody = requireElement<HTMLTableSectionElement>("#signal-table-body");
const resultJson = requireElement<HTMLElement>("#result-json");

for (const approach of AGENTIC_APPROACHES) {
  approachSelect.append(createOption(approach.id, approach.name));
}

const query = new URLSearchParams(window.location.search);
const requestedApproach = AGENTIC_APPROACHES.find(
  ({ id }) => id === query.get("approach"),
);
const firstApproach = AGENTIC_APPROACHES[0];

if (firstApproach === undefined) {
  throw new Error("The approach catalog is empty");
}

let selectedApproach: AgenticApproach = requestedApproach ?? firstApproach;

const requestedMode = query.get("mode");
let selectedMode: EntryMode =
  isEntryMode(requestedMode) && selectedApproach.modes.includes(requestedMode)
    ? requestedMode
    : selectedApproach.modes[0] ?? "launch";

function renderModeOptions(approach: AgenticApproach): void {
  modeSelect.disabled = approach.modes.length === 0;

  if (approach.modes.length === 0) {
    modeSelect.replaceChildren(createOption("", "No browser-operation mode"));
    return;
  }

  const options = approach.modes.map((mode) =>
    createOption(mode, mode === "launch" ? "Agent launches the page" : "Agent takes over this page"),
  );
  modeSelect.replaceChildren(...options);

  if (!approach.modes.includes(selectedMode)) {
    selectedMode = approach.modes[0] ?? "launch";
  }

  modeSelect.value = selectedMode;
}

function renderGuide(): void {
  approachSelect.value = selectedApproach.id;
  renderModeOptions(selectedApproach);
  approachSummary.textContent = selectedApproach.summary;
  expectedSignals.textContent =
    selectedApproach.expectedSignalIds.length === 0
      ? "No deterministic browser-side signal is currently known for this approach."
      : `Signals to watch: ${selectedApproach.expectedSignalIds.join(", ")}`;
  approachDocs.href = `${REPOSITORY_URL}/blob/main/${selectedApproach.docsPath}`;

  const selectedUrl = new URL(window.location.href);
  selectedUrl.searchParams.set("approach", selectedApproach.id);

  if (selectedApproach.modes.length === 0) {
    const limitation =
      selectedApproach.unavailableReason ?? "This approach has no runnable browser mode.";
    const item = document.createElement("li");
    item.textContent = limitation;
    testSteps.replaceChildren(item);
    launchUrlBlock.hidden = true;
    launchUrlValue.textContent = "";
    testPrompt.value = `No runnable prompt. ${limitation}`;
    copyPromptButton.disabled = true;
    selectedUrl.searchParams.delete("mode");
    window.history.replaceState(null, "", selectedUrl);
    return;
  }

  copyPromptButton.disabled = false;

  const instructions = getModeInstructions(selectedApproach, selectedMode);
  testSteps.replaceChildren(
    ...instructions.steps.map((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    }),
  );

  const launchUrl =
    selectedMode === "launch"
      ? buildLaunchUrl(createCurrentPageBaseUrl(), selectedApproach.id)
      : undefined;
  launchUrlBlock.hidden = launchUrl === undefined;
  launchUrlValue.textContent = launchUrl ?? "";
  testPrompt.value = buildTestPrompt(selectedApproach, selectedMode, launchUrl);

  selectedUrl.searchParams.set("mode", selectedMode);
  window.history.replaceState(null, "", selectedUrl);
}

function renderVerdict(
  card: HTMLElement,
  value: HTMLElement,
  detail: HTMLParagraphElement,
  detected: boolean,
  detectedText: string,
  clearText: string,
): void {
  card.classList.toggle("is-detected", detected);
  value.classList.toggle("is-detected", detected);
  value.textContent = detected ? "Detected" : "Not detected";
  detail.textContent = detected ? detectedText : clearText;
}

function formatConclusion(conclusion: string): string {
  return conclusion.replaceAll("_", " ");
}

function renderDetection(result: DetectionResult): void {
  renderVerdict(
    agenticVerdictCard,
    agenticVerdictValue,
    agenticVerdictDetail,
    result.isAgenticUseDetected,
    "A deterministic agent-specific signal was observed in this page session.",
    "No deterministic agent-specific signal observed.",
  );
  renderVerdict(
    genericAutomationVerdictCard,
    genericAutomationVerdictValue,
    genericAutomationVerdictDetail,
    result.isGenericAutomationDetected,
    "A deterministic generic automation signal was observed in this page session.",
    "No deterministic generic automation signal observed.",
  );

  signalTableBody.replaceChildren(
    ...result.signals.map((signal) => {
      const row = document.createElement("tr");
      const signalCell = document.createElement("th");
      const statusCell = document.createElement("td");
      const conclusionCell = document.createElement("td");
      const evidenceCell = document.createElement("td");
      const status = document.createElement("span");
      const evidence = document.createElement("code");

      signalCell.scope = "row";
      signalCell.textContent = signal.id;
      status.className = `signal-status signal-status--${signal.status}`;
      status.textContent = signal.status.replaceAll("_", " ");
      statusCell.dataset.label = "Status";
      statusCell.append(status);
      conclusionCell.dataset.label = "Conclusion";
      conclusionCell.textContent = formatConclusion(signal.proves);
      evidenceCell.dataset.label = "Evidence";
      evidence.textContent = JSON.stringify(signal.evidence);
      evidenceCell.append(evidence);
      row.append(signalCell, statusCell, conclusionCell, evidenceCell);
      return row;
    }),
  );

  resultJson.textContent = JSON.stringify(result, null, 2);
}

const detector = createAgenticUseDetector(defaultProbes);
detector.subscribe(renderDetection);
detector.start();
renderDetection(detector.getResult());
renderGuide();

approachSelect.addEventListener("change", () => {
  const approach = AGENTIC_APPROACHES.find(({ id }) => id === approachSelect.value);
  if (approach === undefined) {
    return;
  }

  selectedApproach = approach;
  renderGuide();
});

modeSelect.addEventListener("change", () => {
  if (!isEntryMode(modeSelect.value) || !selectedApproach.modes.includes(modeSelect.value)) {
    return;
  }

  selectedMode = modeSelect.value;
  renderGuide();
});

copyPromptButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(testPrompt.value);
    copyPromptButton.textContent = "Copied";
  } catch {
    copyPromptButton.textContent = "Select prompt to copy";
    testPrompt.focus();
    testPrompt.select();
  }

  window.setTimeout(() => {
    copyPromptButton.textContent = "Copy prompt";
  }, 1800);
});

let counter = 0;
counterButton.addEventListener("click", () => {
  counter += 1;
  counterOutput.value = `Count: ${counter}`;
});

window.addEventListener("pagehide", () => detector.stop(), { once: true });
