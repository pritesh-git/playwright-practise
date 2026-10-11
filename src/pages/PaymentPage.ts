import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { PaymentData } from '../utils/test-data';

export class PaymentPage extends BasePage {
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;

  // Confirmation
  readonly orderPlacedTitle: Locator;
  readonly orderSuccessMessage: Locator;
  readonly downloadInvoiceBtn: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');

    this.orderPlacedTitle = page.locator('[data-qa="order-placed"]');
    this.orderSuccessMessage = page.locator(
      'p:has-text("Congratulations! Your order has been confirmed!")',
    );
    this.downloadInvoiceBtn = page.locator('a[href*="/download_invoice/"]');
    this.continueBtn = page.locator('[data-qa="continue-button"]');
  }

  async fillPaymentDetails(data: PaymentData) {
    await this.nameOnCardInput.fill(data.nameOnCard);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.cvcInput.fill(data.cvc);
    await this.expiryMonthInput.fill(data.expiryMonth);
    await this.expiryYearInput.fill(data.expiryYear);
  }

  async payAndConfirm(data: PaymentData) {
    await this.fillPaymentDetails(data);
    await this.payButton.click();
  }

  async downloadInvoice() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadInvoiceBtn.click();
    return await downloadPromise;
  }
}
