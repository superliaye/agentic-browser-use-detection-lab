# Appendix: other browser-agent approaches

These approaches are relevant to future research but are outside the v1 Claude/Codex product catalog, so they do not get dedicated pages.

## API reference harnesses

- [Anthropic computer use API](https://docs.anthropic.com/en/docs/agents-and-tools/computer-use): developers run the tool loop and browser or desktop environment.
- [OpenAI computer use API](https://platform.openai.com/docs/guides/tools-computer-use): developers supply the browser/computer harness and execute returned actions.

Detection depends on the chosen harness, browser launch flags, transport, and input path—not only the model provider.

## Browser-control frameworks

- [Browser Use](https://github.com/browser-use/browser-use)
- [Stagehand](https://github.com/browserbase/stagehand)
- [Playwright](https://playwright.dev/) and [Puppeteer](https://pptr.dev/)
- [Selenium](https://www.selenium.dev/)

These may expose `navigator.webdriver`, Playwright globals, or no current runtime signal, depending on configuration.

## Other agent hosts and products

- Pi and other coding-agent harnesses with browser tools or MCP.
- DeepSeek-backed agent harnesses assembled by third parties.
- Browserbase and other hosted browser infrastructure.
- Agentic browsers and extensions such as Comet, Manus, or similar products.

“Uses DeepSeek,” “uses Pi,” or another model label is not a browser mechanism. A future catalog entry should name the actual controller—extension, CDP client, WebDriver session, native computer use, or remote browser—and test that concrete path.
