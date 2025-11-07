import { Page } from 'playwright';
import { helper } from '../Fixtures/fixture';

export class HomePage {
  constructor(private page: Page) {
    this.page = page;
  }


  private automationLink = 'a[name="automations"]';

  async navigateToPage(pageName: string ) {

    helper.clickLinkByText(pageName);
    console.log(`Navigated to the "${pageName}" page successfully`);
  }
}

