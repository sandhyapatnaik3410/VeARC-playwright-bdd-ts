import { Page } from 'playwright';

export class AutomationPage {
  constructor(private page: Page) {
    this.page = page;
  }

  private createDropdownBtn = 'div.rio-toolbar__items-container button[name="createOptions"]';
  private taskBotDropdown = (actionName: string) => `//span[contains(text(),"${actionName}")][1]`;


  async clickCreateDropdown() {
    await this.page.waitForSelector(this.createDropdownBtn);
    console.log("Create Dropdown is visible");
    await this.page.click(this.createDropdownBtn);
    console.log("Clicked on Create Dropdown");
  }

  async clickDropdownOption(optionName: string) {
    await this.page.waitForSelector(this.taskBotDropdown(optionName));
    await this.page.click(this.taskBotDropdown(optionName));
  }


}