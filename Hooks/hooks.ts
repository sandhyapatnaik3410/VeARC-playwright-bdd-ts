import { After, Before, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, Page } from "playwright";
import config from "../playwright.config";
import { initPages } from "../Fixtures/fixture";
import fs from "fs";
import path from "path";

setDefaultTimeout(60_000);

const reportsDir = path.resolve("reports");
const screenshotsDir = path.join(reportsDir, "screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });

Before(async function (this: any) {
  const cfg = (config as any)?.use ?? {};
  const headless = process.env.HEADLESS === "true" ? true : cfg.headless ?? true;

  const browser: Browser = await chromium.launch({
    headless,
    args: ["--start-maximized"],
  });

  const context: BrowserContext = await browser.newContext({
    baseURL: cfg.baseURL ?? "https://community.cloud.automationanywhere.digital/",
    viewport: cfg.viewport ?? null,
    ignoreHTTPSErrors: cfg.ignoreHTTPSErrors ?? true,
  });

  const page: Page = await context.newPage();

  // initPages returns { loginPage, homePage, ... }
  const pages = initPages(page);

  // Attach everything to Cucumber World in one go
  Object.assign(this, { browser, context, page, ...pages });

  console.log("[Hook] Browser + page objects attached.");
});

After(async function (this: any, scenario: any) {
  const page: Page | undefined = this.page;

  // Capture screenshot only for failed tests
  if ((scenario.result?.status === Status.FAILED || scenario.result?.status === "failed") && page) {
    const safeName = (scenario.pickle?.name || "failed_scenario")
      .replace(/\s+/g, "_")
      .slice(0, 100);
    const screenshotPath = path.join(screenshotsDir, `${Date.now()}-${safeName}.png`);

    try {
      // capture screenshot and get Buffer returned by Playwright
      const buffer: Buffer = await page.screenshot({ path: screenshotPath, fullPage: true }) as Buffer;
      console.log(`[Hook] Screenshot saved: ${screenshotPath} (size=${buffer.length})`);

      // Attach screenshot to Cucumber JSON report: try Buffer first (preferred)
      if (typeof this.attach === "function") {
        try {
          await this.attach(buffer, "image/png");
          console.log(`[Hook] Screenshot attached as Buffer to report.`);
        } catch (attachErr) {
          // fallback: attach base64 string if attach(buffer, ...) fails for some combos
          const base64 = buffer.toString("base64");
          await this.attach(base64, "image/png");
          console.log(`[Hook] Screenshot attached as base64 (fallback) to report.`);
        }
      } else {
        console.warn("[Hook] this.attach is not a function — screenshot saved to:", screenshotPath);
      }
    } catch (err) {
      console.error("[Hook] Failed to capture/attach screenshot:", err);
    }
  }

  // Always close browser
  try {
    const activeBrowser: Browser | undefined = this.browser;
    if (activeBrowser && activeBrowser.isConnected()) {
      await activeBrowser.close();
      console.log("Browser closed after scenario execution.");
    } else {
      console.warn("No active browser instance found to close.");
    }
  } catch (err) {
    console.warn("Error while closing browser:", err);
  }
});