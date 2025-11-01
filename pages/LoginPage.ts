import { Page } from 'playwright';

export class LoginPage {
  constructor(private page: Page) {
    this.page = page;
  }

  private usernameInput = 'input[name="username"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'button[name="submitLogin"]';
  private automationLink = 'a[name="automations"]';

  async navigate(url: string): Promise<void>  {
    await this.page.goto(url, { timeout: 120000 });
    console.log("Navigated to the URL");
  }

  async enterCredentials(username: string, password: string): Promise<void>  {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() : Promise<void> {
    console.log("[LoginPage] Clicking on Login button...");
  await this.page.click(this.loginButton);

  // Wait until navigation completes or home element appears
  const homePageLoaded = await this.page.waitForSelector(this.automationLink, {
    state: 'visible',
    timeout: 15000, // wait up to 15 seconds for home page to load
  }).then(() => true).catch(() => false);

  if (homePageLoaded) {
    console.log("Home page loaded successfully after login.");
  } else {
    console.error("Home page did not load or Automation link not found.");
    throw new Error("Login failed: Automation link not visible after clicking login.");
  }

  }

}