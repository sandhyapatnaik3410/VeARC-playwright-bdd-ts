import { Page, expect } from '@playwright/test';
import { initPages, homePage, helper, globalVariables,
        productsPage} from '../Fixtures/fixture';


export class ProductsPage {
  constructor(private page: Page) {}

  private productName = (product: string) =>
     `//div[@class='item-box'][.//a[normalize-space(text())="${product}"]]//input[@value="Add to cart"]`;
  private addToCartButton = '//input[@value="Add to cart"]';
  private productAddToCartBtn = (product: string) =>
    `//div[@class='item-box'][.//a[normalize-space(text())='${product}']]//input[@value='Add to cart']`;
  private actualCartCount = 'td[class="qty nobr"] input';
  private cartConfirmation = `.bar-notification` ;
  private updateShoppingCart = 'input[name="updatecart"]';
  private checkOutBtn = 'button[id="checkout"]';
  private termsofserviceCheckBox = 'input#termsofservice';
  private continueButton = 'input[value="Continue"]';
  private confirmBtn = 'input[value="Confirm"]';
  private orderSuccessMsg = 'div.section.order-completed strong';
  private billingContinueBtn = '#billing-buttons-container input[value="Continue"]';
  private shippingContinueBtn = '#shipping-buttons-container input[value="Continue"]';
  private shippingMethodContinueBtn = '#shipping-method-buttons-container input[value="Continue"]';
  private paymentMethodContinueBtn = '#payment-method-buttons-container input[value="Continue"]';
  private paymentInfoContinueBtn = '#payment-info-buttons-container input[value="Continue"]';
  private thankYouContinueBtn = '//input[contains(@class, "order-completed-continue-button")]';

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
    const addToCartButton = this.page.locator(this.productAddToCartBtn(productName));

    await addToCartButton.waitFor({ state: 'visible' , timeout: 10000});
    await addToCartButton.scrollIntoViewIfNeeded();
    
    expect(addToCartButton).toBeVisible();

    await addToCartButton.click({ force: true });

    console.log(`Added "${productName}" to cart`);
      
    const toast = this.page.locator(this.cartConfirmation);
    await toast.waitFor({ state: 'visible', timeout: 7000 }).catch(() => {});

    // Verify success message is visible (optional)
    if (await toast.isVisible()) {
      console.log(`"${productName}" added to cart successfully.`);
    } else {
      console.warn(`"${productName}" added to cart but no success toast appeared.`);
    }
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
    
    await productLocator.waitFor({ state: 'visible', timeout: 10000 });
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

  async clickOnContinueBtn(section: string) {
    let continueBtn;

    switch(section) {
        case 'Billing address':
            continueBtn = this.page.locator(this.billingContinueBtn);
            break;
        case 'Shipping address':
            continueBtn = this.page.locator(this.shippingContinueBtn);
            break;
        case 'Shipping method':
            continueBtn = this.page.locator(this.shippingMethodContinueBtn);
            break;
        case 'Payment method':
            continueBtn = this.page.locator(this.paymentMethodContinueBtn);
            break;
        case 'Payment information':
            continueBtn = this.page.locator(this.paymentInfoContinueBtn);
            break;
        case 'Thank you':
            continueBtn = this.page.locator(this.thankYouContinueBtn);
            break;
        default:
            throw new Error(`Unknown section: ${section}`);
    }

    await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
    await continueBtn.click();
    console.log(`Clicked Continue button for ${section}`);
  }

  async clickOnConfirmBtn(){
    const confirmButton = this.page.locator(this.confirmBtn);
    await confirmButton.scrollIntoViewIfNeeded();
    await confirmButton.click({force: true});    
    console.log(`Click on confirm button`);

  }
  async verifySuccessMessage() {
    const successMsg = this.page.locator(this.orderSuccessMsg);
    await successMsg.waitFor({ state: 'visible', timeout: 10000 });
    await expect(successMsg).toBeVisible();
    const text = await successMsg.textContent();
    console.log(`actual success message: `+ text );
    // Normalize and assert
    expect(text?.trim()).toBe("Your order has been successfully processed!");

    console.log(`Verified success message: "${text?.trim()}"`);
  }


}