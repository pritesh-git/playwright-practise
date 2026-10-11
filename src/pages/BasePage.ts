import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly navHome: Locator;
  readonly navProducts: Locator;
  readonly navCart: Locator;
  readonly navAuth: Locator;
  readonly navLogout: Locator;
  readonly navDeleteAccount: Locator;
  readonly navTestCases: Locator;
  readonly navApiTesting: Locator;
  readonly navVideoTutorials: Locator;
  readonly navContact: Locator;
  readonly loggedInUserText: Locator;
  readonly headerLogo: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionSubmitBtn: Locator;
  readonly subscriptionSuccessAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navHome = page.locator('header .shop-menu a[href="/"]');
    this.navProducts = page.locator('header .shop-menu a[href="/products"]');
    this.navCart = page.locator('header .shop-menu a[href="/view_cart"]');
    this.navAuth = page.locator('header .shop-menu a[href="/login"]');
    this.navLogout = page.locator('header .shop-menu a[href="/logout"]');
    this.navDeleteAccount = page.locator('header .shop-menu a[href="/delete_account"]');
    this.navTestCases = page.locator('header .shop-menu a[href="/test_cases"]').first();
    this.navApiTesting = page.locator('header .shop-menu a[href="/api_list"]').first();
    this.navVideoTutorials = page.locator('header .shop-menu a[href*="youtube.com"]').first();
    this.navContact = page.locator('header .shop-menu a[href="/contact_us"]');
    this.loggedInUserText = page.locator('header .shop-menu li:has-text("Logged in as")');
    this.headerLogo = page.locator('header .logo a');
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscriptionSubmitBtn = page.locator('#subscribe');
    this.subscriptionSuccessAlert = page.locator('#success-subscribe .alert-success');
  }

  /**
   * Block intrusive ads and third-party tracking scripts to guarantee ultra-fast, stable runs
   */
  static async setupAdBlocking(page: Page): Promise<void> {
    await page.route('**/*googlesyndication*/**', (route) => route.abort());
    await page.route('**/*googleads*/**', (route) => route.abort());
    await page.route('**/*doubleclick*/**', (route) => route.abort());
    await page.route('**/*adservice*/**', (route) => route.abort());
    await page.route('**/*google-analytics*/**', (route) => route.abort());
  }

  /**
   * Submits email to the newsletter subscription input in the footer
   */
  async subscribeNewsletter(email: string) {
    await this.subscriptionEmailInput.scrollIntoViewIfNeeded();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitBtn.click();
    await this.subscriptionSuccessAlert.waitFor({ state: 'visible' });
  }

  /**
   * Logs out current user if logged in
   */
  async logout() {
    await this.navLogout.click();
    await expect(this.page).toHaveURL(/.*login/);
  }

  /**
   * Deletes user account and asserts success message
   */
  async deleteAccountAndContinue() {
    await this.navDeleteAccount.click();
    await expect(this.page.locator('[data-qa="account-deleted"]')).toBeVisible();
    await this.page.locator('[data-qa="continue-button"]').click();
  }
}
