import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Slider Carousel
  readonly sliderCarousel: Locator;
  readonly carouselIndicators: Locator;
  readonly carouselInner: Locator;
  readonly carouselActiveHeading: Locator;
  readonly carouselItems: Locator;
  readonly carouselPrevBtn: Locator;
  readonly carouselNextBtn: Locator;

  // Sidebar Categories & Brands
  readonly categorySidebar: Locator;
  readonly categoryWomenHeading: Locator;
  readonly categoryMenHeading: Locator;
  readonly categoryKidsHeading: Locator;
  readonly brandsSidebar: Locator;
  readonly brandsList: Locator;

  // Featured Items
  readonly featuredItemsTitle: Locator;
  readonly featuredProducts: Locator;

  // Recommended Items
  readonly recommendedItemsTitle: Locator;
  readonly recommendedProducts: Locator;
  readonly recommendedPrevBtn: Locator;
  readonly recommendedNextBtn: Locator;

  // Cart Modal
  readonly cartModal: Locator;
  readonly cartModalTitle: Locator;
  readonly continueShoppingBtn: Locator;
  readonly viewCartModalLink: Locator;

  constructor(page: Page) {
    super(page);
    this.sliderCarousel = page.locator('#slider-carousel');
    this.carouselIndicators = page.locator('#slider-carousel .carousel-indicators li');
    this.carouselInner = page.locator('#slider-carousel .carousel-inner');
    this.carouselActiveHeading = page.locator('#slider-carousel .carousel-inner .item.active h1');
    this.carouselItems = page.locator('#slider-carousel .carousel-inner .item');
    this.carouselPrevBtn = page.locator('#slider-carousel .left.control-carousel');
    this.carouselNextBtn = page.locator('#slider-carousel .right.control-carousel');

    this.categorySidebar = page.locator('.category-products');
    this.categoryWomenHeading = page.locator('a[href="#Women"]');
    this.categoryMenHeading = page.locator('a[href="#Men"]');
    this.categoryKidsHeading = page.locator('a[href="#Kids"]');
    this.brandsSidebar = page.locator('.brands_products');
    this.brandsList = page.locator('.brands-name ul li a');

    this.featuredItemsTitle = page.locator('.features_items h2.title');
    this.featuredProducts = page.locator('.features_items .col-sm-4');

    this.recommendedItemsTitle = page.locator('.recommended_items h2.title');
    this.recommendedProducts = page.locator('.recommended_items .col-sm-4');
    this.recommendedPrevBtn = page.locator('.recommended_items a.left');
    this.recommendedNextBtn = page.locator('.recommended_items a.right');

    this.cartModal = page.locator('#cartModal');
    this.cartModalTitle = page.locator('#cartModal .modal-title');
    this.continueShoppingBtn = page.locator('#cartModal button.close-modal');
    this.viewCartModalLink = page.locator('#cartModal a[href="/view_cart"]');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async addFeaturedProductToCart(index: number, continueShopping: boolean = true) {
    const card = this.featuredProducts.nth(index);
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await card.locator('.add-to-cart').first().click();
    await this.cartModal.waitFor({ state: 'visible' });
    if (continueShopping) {
      await this.continueShoppingBtn.click();
      await this.cartModal.waitFor({ state: 'hidden' });
    } else {
      await this.viewCartModalLink.click();
    }
  }

  async addRecommendedProductToCart(index: number, continueShopping: boolean = true) {
    const card = this.recommendedProducts.nth(index);
    await card.scrollIntoViewIfNeeded();
    await card.locator('.add-to-cart').click();
    await this.cartModal.waitFor({ state: 'visible' });
    if (continueShopping) {
      await this.continueShoppingBtn.click();
      await this.cartModal.waitFor({ state: 'hidden' });
    } else {
      await this.viewCartModalLink.click();
    }
  }

  async clickCategorySubcategory(category: 'Women' | 'Men' | 'Kids', subCategoryHref: string) {
    const header =
      category === 'Women'
        ? this.categoryWomenHeading
        : category === 'Men'
          ? this.categoryMenHeading
          : this.categoryKidsHeading;
    await header.scrollIntoViewIfNeeded();
    await header.click();
    const subLink = this.page.locator(`a[href="${subCategoryHref}"]`);
    await subLink.waitFor({ state: 'visible' });
    await subLink.click();
  }

  async clickBrand(brandName: string) {
    await this.brandsSidebar.scrollIntoViewIfNeeded();
    const brandLink = this.brandsList.filter({ hasText: brandName }).first();
    await brandLink.click();
  }
}
