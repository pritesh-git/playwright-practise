import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutBtn: Locator;
  readonly checkoutModal: Locator;
  readonly checkoutModalRegisterLoginLink: Locator;

  constructor(page: Page) {
    super(page);

    this.cartTable = page.locator('#cart_info_table');
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.emptyCartMessage = page.locator('#empty_cart');
    this.proceedToCheckoutBtn = page.locator('.check_out');
    this.checkoutModal = page.locator('#checkoutModal');
    this.checkoutModalRegisterLoginLink = page.locator('#checkoutModal a[href="/login"]');
  }

  async goto() {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
  }

  async getItemCount(): Promise<number> {
    return await this.cartRows.count();
  }

  async deleteItemByIndex(index: number) {
    const row = this.cartRows.nth(index);
    await row.locator('.cart_quantity_delete').click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutBtn.waitFor({ state: 'visible' });
    await this.proceedToCheckoutBtn.click();
  }
}
