import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, Page } from "playwright";
import { helper, initPages, loginPage } from '../Fixtures/fixture';
// import { setBrowser } from "../Hooks/hooks";
import config from "../playwright.config";


let browser: Browser;
let page: Page;
let context: BrowserContext;

// setDefaultTimeout(120000);

When("I launch the browser", async function () {
  const cfg = (config as any)?.use ?? {};
  const headless =
    process.env.HEADLESS === "true" ? true : cfg.headless ?? false;

  browser = await chromium.launch({
    headless,
    args: ["--start-maximized"],
  });

  context = await browser.newContext({
    baseURL: cfg.baseURL,
    viewport: cfg.viewport ?? null,
    ignoreHTTPSErrors: cfg.ignoreHTTPSErrors ?? true,
  });

  page = await context.newPage();
  initPages(page);

  // Attach to cucumber world (this) for later steps
  this.browser = browser;
  this.context = context;
  this.page = page;

  console.log("Browser launched and page opened.");
});

When("I navigate to a url", async function () {
  const baseURL = (config as any)?.use?.baseURL;
  await loginPage.navigate(baseURL);
});

Then("click on the login link", async function () {
  await loginPage.clickLoginLink();
});

When('the user navigates to the {string} link', async function (workspaceName: string) {
  helper.clickLinkByText(workspaceName);
  console.log(`Clicked on "${workspaceName}" link `);
});

Given("logged into the Demo Web Shop application of Tricentis", async function () {
  await loginPage.enterCredentials('test11nov@test.com', '123456');
  await loginPage.clickLogin();
});
