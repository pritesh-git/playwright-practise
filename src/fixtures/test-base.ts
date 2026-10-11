import { test as base } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ContactPage } from '../pages/ContactPage';
import { StaticPages } from '../pages/StaticPages';

type AppFixtures = {
  homePage: HomePage;
  authPage: AuthPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  contactPage: ContactPage;
  staticPages: StaticPages;
};

export const test = base.extend<AppFixtures>({
  // Configure ad blocking for every test run to keep tests fast and resilient
  page: async ({ page }, use) => {
    await BasePage.setupAdBlocking(page);
    await use(page);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  staticPages: async ({ page }, use) => {
    await use(new StaticPages(page));
  },
});

export { expect } from '@playwright/test';
