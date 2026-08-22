import "./styles.css";

const app = document.querySelector<HTMLElement>("#app");

if (app === null) {
  throw new Error("Missing #app root element");
}

app.innerHTML = `
  <section class="shell">
    <p class="eyebrow">Research playground</p>
    <h1>Agentic Browser Use Detection Lab</h1>
  </section>
`;
