import { Page } from 'playwright';

export class LoginPage {
  constructor(private page: Page) {
    this.page = page;
  }

  private loginLink = 'a.ico-login';
  private emailInput = 'input#Email';
  private passwordInput = 'input#Password';
  private loginButton = 'div.buttons input.button-1.login-button';
  private logoutLink = 'a.ico-logout';

  async navigate(url: string): Promise<void>  {
    await this.page.goto(url, { timeout: 120000 });
    console.log("Navigated to the URL");
  }

  async clickLoginLink() {
    await this.page.getByText("Log in").click();
    // await this.page.locator(this.loginLink).click();
    console.log("Clicked on the Login link successfully");
  }

  async enterCredentials(username: string, password: string): Promise<void>  {
    await this.page.fill(this.emailInput, username);
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() : Promise<void> {
    console.log("[LoginPage] Clicking on Login button...");
    await this.page.click(this.loginButton);

  // Wait until navigation completes or home element appears
  const homePageLoaded = await this.page.waitForSelector(this.logoutLink, {
    state: 'visible',
    timeout: 15000, // wait up to 15 seconds for home page to load
  }).then(() => true).catch(() => false);

  if (homePageLoaded) {
    console.log("Home page loaded successfully after login.");
  } else {
    console.error("User login failed.");
    throw new Error("Login failed: not visible after clicking login.");
  }

  }

}