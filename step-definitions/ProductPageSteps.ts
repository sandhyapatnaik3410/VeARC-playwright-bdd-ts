import { Given, When, Then, setDefaultTimeout, DataTable } from "@cucumber/cucumber";
import { chromium, Browser, Page, expect } from "@playwright/test";
import { initPages, homePage, helper, globalVariables,
    productsPage } from '../Fixtures/fixture';
import { TIMEOUT } from "dns";


let page: Page;

// setDefaultTimeout(120000);

When('I add {string} to the cart', async function (productName: string) {
  await productsPage.addProductToCart(productName);
});

When('the user navigates to the {string} page', async function (linkName: string) {
  console.log(`Clicking on the "${linkName}" link...`);

  // Click the link based on its accessible name (exact match)
  helper.clickLinkByText(linkName);

  // await this.page.locator(`a:has-text("${linkName}")`).first().click();

  // Wait for navigation or content load (prevents flaky behavior)
  await this.page.waitForLoadState('domcontentloaded');
  expect(await this.page.getByRole('heading', { name: 'Shopping cart'})).toBeVisible();

  console.log(`Successfully clicked on the "${linkName}" link`);
});

Then('verify the cart should show {int} items', async function(expectedCount: number) {
  await productsPage.verifyCartCount(expectedCount);

});

Then('the item name {string} should be visible in the Shopping Cart page', async function (itemName: string) {
  const actualText = await productsPage.getProductName(itemName);
  expect(actualText).toBe(itemName);
  console.log(`Verified the item name "${actualText}" is visible in the Add to Cart page.`);
});

When('the user clears the cart', async function () {
  productsPage.clearCart();
});

Then('the cart should be empty', async function () {

  const actualMessage = await productsPage.getEmptyCartMessage();
  expect(actualMessage).toBe("Your Shopping Cart is empty!");
  console.log(`Verified the cart is empty with message: "${actualMessage}"`);
    
});

Then('I click on the checkout button', async function () {
    productsPage.clickOnCheckoutBtn();
    console.log("Clicked on checkout button");
});

Then('I accept the terms and conditions', async function () {
    productsPage.acceptTermsAndConditions();
    console.log("Accepted Terms and Conditions");
});


Then('I click on continue button', async function () {
    productsPage.clickOnContinueBtn();
    console.log("Clicked on continue button");
});

Then('I click on confirm button', async function () {
    productsPage.clickOnConfirmBtn();
    console.log("Clicked on confirm button");
});

Then('verify the order creation success message', async function () {
    productsPage.verifySuccessMessage();
    console.log("Order created successfully");
});