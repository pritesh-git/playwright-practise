import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly deliveryAddress: Locator;
  readonly invoiceAddress: Locator;
  readonly cartReviewTable: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.deliveryAddress = page.locator('#address_delivery');
    this.invoiceAddress = page.locator('#address_invoice');
    this.cartReviewTable = page.locator('#cart_info_table');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderBtn = page.locator('a[href="/payment"]');
  }

  async enterComment(comment: string) {
    await this.commentTextarea.scrollIntoViewIfNeeded();
    await this.commentTextarea.fill(comment);
  }

  async placeOrder() {
    await this.placeOrderBtn.scrollIntoViewIfNeeded();
    await this.placeOrderBtn.click();
  }
}
