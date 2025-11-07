import { Page, expect } from '@playwright/test';
import { initPages, homePage, helper, globalVariables,
        productsPage} from '../Fixtures/fixture';


export class ProductsPage {
  constructor(private page: Page) {}

  private productName = (product: string) =>
     `//div[@class='item-box'][.//a[normalize-space(text())="${product}"]]//input[@value="Add to cart"]`;
  private addToCartButton = '//input[@value="Add to cart"]';
  private addToCartXpath = (product: string) =>
    `//div[@class='item-box'][.//a[normalize-space(text())='${product}']]//input[@value='Add to cart']`;
  private actualCartCount = 'td[class="qty nobr"] input';
  private cartConfirmation = `.bar-notification` ;
  private updateShoppingCart = 'input[name="updatecart"]';
  private checkOutBtn = 'button[id="checkout"]';
  private termsofserviceCheckBox = 'input#termsofservice';
  private continueButton = 'input[value="Continue"]';
  private confirmBtn = 'input[value="Confirm"]';
  private orderSuccessMsg = 'div[class="section order-completed"] strong'

  async addProductToCart1(productName: string) {
    const productSection = this.page.getByRole('heading', { name: `${productName}`, exact: true })
    console.log("product selection: " + productSection);
    await productSection.scrollIntoViewIfNeeded();

    // move to parent and click add to cart button
    await productSection.locator('..').locator(this.addToCartButton).click({force: true});

    console.log(`Added "${productName}" to cart`);
    
    const cartConfirmationMessage = this.page.locator(this.cartConfirmation); 
    await cartConfirmationMessage.waitFor({ state: 'visible', timeout: 5000 });


  }

  async addProductToCart(productName: string) {
    const addToCartButton = this.page.locator(this.addToCartXpath(productName));

    // Wait until the product section is visible and scroll into view
    await addToCartButton.scrollIntoViewIfNeeded();
    await addToCartButton.waitFor({ state: 'visible' });

    // Click the "Add to cart" button
    await addToCartButton.click({ force: true });

    console.log(`Added "${productName}" to cart`);
  }

  async verifyCartCount(expectedCount: number){
    // Wait for the cart count to be visible
    const cartCountLocator = this.page.locator(this.actualCartCount);
    await cartCountLocator.waitFor({ state: 'visible', timeout: 5000 });

    // Get the text and convert to number
    const countText = await cartCountLocator.inputValue();
    
    // Remove non-numeric characters like parentheses
    const count = Number(countText?.replace(/\D/g, ''));

    // Assert the count matches expected
    expect(count).toBe(expectedCount);
    
  }

  async getProductName(expectedName: string): Promise<string> {
    // const productLocator = this.page.locator('a.product-name');
    const productLocator = this.page.locator('a.product-name', { hasText: expectedName });
    
    // Wait for it to be visible
    await productLocator.waitFor({ state: 'visible', timeout: 10000 });
    
    // Get the visible text
    const text = await productLocator.innerText();
    
    return text.trim(); // trim extra whitespace
  }

  async clearCart(){
    await this.page.locator(this.updateShoppingCart).waitFor({state: 'hidden', timeout: 5000});
    const removeCheckboxes = this.page.locator(`input[name="removefromcart"]`);
    //this.page.getByRole('checkbox', { name: 'removefromcart' });
    console.log("remove buttons" + removeCheckboxes);

    const count = await removeCheckboxes.count();
    console.log(`Found ${count} items in the cart`);

    for (let i = 0; i < count; i++) {
      await removeCheckboxes.nth(i).check({force:true});
      console.log('Check box selected for "${i}"st product' );
    }

    const updateCartButton = await this.page.locator(this.updateShoppingCart);
    await updateCartButton.waitFor({ state: 'visible', timeout: 5000 });
    await updateCartButton.click({ force: true });
    console.log('All items removed from the cart');
  }

  async getEmptyCartMessage(): Promise<string> {
    const emptyCartMsgLocator = this.page.locator('div.order-summary-content');
    await emptyCartMsgLocator.waitFor({ state: 'visible', timeout: 10000 });
    const text = await emptyCartMsgLocator.textContent();
    return text?.trim() || '';
  }

  async clickOnCheckoutBtn(){
    await this.page.locator(this.checkOutBtn).click({force: true});
  }

  async acceptTermsAndConditions(){
    await this.page.locator(this.termsofserviceCheckBox).click({force:true});
    console.log("Agreed terms of service");
  }

  async clickOnContinueBtn(){
    const continueBtn = await this.page.locator(this.continueButton);

        await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
    await continueBtn.waitFor({ state: 'attached', timeout: 10000 });

    // Scroll into view if needed
    await continueBtn.scrollIntoViewIfNeeded();

    // Click the confirm button
    await continueBtn.click({ force: true });

    // await continueBtn.first().click({force: true});
    console.log(`Click on continue button`);

  }

  async clickOnConfirmBtn(){
    const confirmButton = this.page.locator(this.confirmBtn);
    await confirmButton.scrollIntoViewIfNeeded();
    await confirmButton.click({force: true});    
    console.log(`Click on confirm button`);

  }

async verifySuccessMessage() {
    const successMsg = this.page.locator(this.orderSuccessMsg);
    
    // Wait for the element to be visible
    await successMsg.waitFor({ state: 'visible', timeout: 6000 });
    
    // Get the text content
    const text = await successMsg.innerText();
    
    // Assertion
    expect(text).toBe("Your order has been successfully processed!");
}

}