import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartBtn: Locator;
  readonly availability: Locator;
  readonly condition: Locator;
  readonly brand: Locator;

  // Review section
  readonly reviewHeading: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextInput: Locator;
  readonly reviewSubmitBtn: Locator;
  readonly reviewSuccessAlert: Locator;

  // Cart modal
  readonly continueShoppingBtn: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    super(page);

    this.productName = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p:has-text("Category:")');
    this.productPrice = page.locator('.product-information span span');
    this.quantityInput = page.locator('#quantity');
    this.addToCartBtn = page.locator('.product-information button.cart');
    this.availability = page.locator('.product-information p:has-text("Availability:")');
    this.condition = page.locator('.product-information p:has-text("Condition:")');
    this.brand = page.locator('.product-information p:has-text("Brand:")');

    this.reviewHeading = page.locator('a[href="#reviews"]');
    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewTextInput = page.locator('#review');
    this.reviewSubmitBtn = page.locator('#button-review');
    this.reviewSuccessAlert = page.locator('#review-section .alert-success');

    this.continueShoppingBtn = page.locator('#cartModal button.close-modal');
    this.viewCartLink = page.locator('#cartModal a[href="/view_cart"]');
  }

  async goto(productId: number | string = 1) {
    await this.page.goto(`/product_details/${productId}`, { waitUntil: 'domcontentloaded' });
  }

  async setQuantity(qty: number) {
    await this.quantityInput.fill(qty.toString());
  }

  async addToCart(viewCart: boolean = false) {
    await this.addToCartBtn.click();
    await this.page.locator('#cartModal').waitFor({ state: 'visible' });
    if (viewCart) {
      await this.viewCartLink.click();
    } else {
      await this.continueShoppingBtn.click();
      await this.page.locator('#cartModal').waitFor({ state: 'hidden' });
    }
  }

  async submitReview(name: string, email: string, reviewText: string) {
    await this.reviewHeading.scrollIntoViewIfNeeded();
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextInput.fill(reviewText);
    await this.reviewSubmitBtn.click();
    await this.reviewSuccessAlert.waitFor({ state: 'visible' });
  }
}
