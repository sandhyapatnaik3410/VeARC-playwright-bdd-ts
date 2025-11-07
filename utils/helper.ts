import { Page } from 'playwright';

export class Helper {

  constructor(private page: Page) {
    }

  /**
   * Generates a unique form name in the format Form_DDMMHHSS
   * Example: Form_30101542 → 30th Oct, 10:15:42
   */
   generateUniqueName(prefix: string): string {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, "0");

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    const uniqueName = `${prefix}_${day}${month}${hours}${minutes}${seconds}`;
    console.log(`Generated unique name: ${uniqueName}`);
    return uniqueName;
  }

  async getLinkText(visibleText: string): Promise<string> {
    const locator = this.page.locator(`a:has-text("${visibleText}")`);
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    const text = await locator.innerText();
    return text.trim();
  }

  async clickLinkByText(visibleText: string): Promise<void> {
    const locator = this.page.locator(`a:has-text("${visibleText}")`).first();
    await locator.waitFor({ state: 'visible', timeout: 6000 });
    await locator.click({force: true});
    console.log(`Clicked on link with text: "${visibleText}"`);
  }

}
