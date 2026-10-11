import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly titleHeader: Locator;
  readonly searchInput: Locator;
  readonly searchBtn: Locator;
  readonly productCards: Locator;
  readonly continueShoppingBtn: Locator;
  readonly viewCartModalLink: Locator;
  readonly categoryWomenHeading: Locator;
  readonly categoryMenHeading: Locator;
  readonly categoryKidsHeading: Locator;
  readonly brandsList: Locator;

  constructor(page: Page) {
    super(page);

    this.titleHeader = page.locator('.features_items h2.title');
    this.searchInput = page.locator('#search_product');
    this.searchBtn = page.locator('#submit_search');
    this.productCards = page.locator('.features_items .col-sm-4');
    this.continueShoppingBtn = page.locator('#cartModal button.close-modal');
    this.viewCartModalLink = page.locator('#cartModal a[href="/view_cart"]');

    this.categoryWomenHeading = page.locator('a[href="#Women"]');
    this.categoryMenHeading = page.locator('a[href="#Men"]');
    this.categoryKidsHeading = page.locator('a[href="#Kids"]');
    this.brandsList = page.locator('.brands-name ul li a');
  }

  async goto() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
  }

  async searchProduct(name: string) {
    await this.searchInput.fill(name);
    await this.searchBtn.click();
  }

  async addProductToCartByIndex(index: number, continueShopping: boolean = true) {
    const targetProduct = this.productCards.nth(index);
    await targetProduct.scrollIntoViewIfNeeded();
    await targetProduct.hover();
    await targetProduct.locator('.add-to-cart').first().click();
    await this.page.locator('#cartModal').waitFor({ state: 'visible' });
    if (continueShopping) {
      await this.continueShoppingBtn.click();
      await this.page.locator('#cartModal').waitFor({ state: 'hidden' });
    } else {
      await this.viewCartModalLink.click();
    }
  }

  async viewProductDetailsByIndex(index: number) {
    const targetProduct = this.productCards.nth(index);
    await targetProduct.scrollIntoViewIfNeeded();
    await targetProduct.locator('a[href*="/product_details/"]').first().click();
  }

  async filterByCategory(category: 'Women' | 'Men' | 'Kids', subCategoryHref: string) {
    const header =
      category === 'Women'
        ? this.categoryWomenHeading
        : category === 'Men'
          ? this.categoryMenHeading
          : this.categoryKidsHeading;
    await header.scrollIntoViewIfNeeded();
    await header.click();
    const subLink = this.page.locator(`a[href="${subCategoryHref}"]`);
    await subLink.waitFor({ state: 'attached' });
    await subLink.dispatchEvent('click');
  }

  async filterByBrand(brandName: string) {
    const brandLink = this.brandsList.filter({ hasText: brandName }).first();
    await brandLink.scrollIntoViewIfNeeded();
    await brandLink.click();
  }
}
