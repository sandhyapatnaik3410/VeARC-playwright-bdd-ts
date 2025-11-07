import { Page } from 'playwright';
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { Helper } from '../utils/helper';
import { GlobalVariables } from '../utils/globalVariables';
import { ProductsPage } from '../pages/ProductsPage';


// module-level holders (will be set when page is ready)
export let loginPage: LoginPage;
export let homePage: HomePage;
export let helper: Helper;
export let globalVariables: GlobalVariables;
export let productsPage: ProductsPage;

let pageInstance: Page | null = null;

/**
 * Initialize all page objects using the provided Playwright Page instance.
 * Call this immediately after creating your Playwright page (browser.newPage()).
 */
export const initPages = (page: Page) => {
  pageInstance = page;

  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  helper = new Helper(page);
  globalVariables = GlobalVariables.getInstance(page);
  productsPage = new ProductsPage(page);

  return { loginPage, homePage, helper, globalVariables,
            productsPage
           };
};