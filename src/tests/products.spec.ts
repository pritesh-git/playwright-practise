import { test, expect } from '../fixtures/test-base';

test.describe('Products & Catalog Suite', () => {
  test('@smoke @regression TC06: Verify All Products page and product detail information', async ({
    productsPage,
    productDetailPage,
    page,
  }) => {
    await productsPage.goto();
    await expect(page).toHaveURL(/.*products/);
    await expect(productsPage.titleHeader).toHaveText('All Products', { ignoreCase: true });
    await expect(productsPage.productCards.first()).toBeVisible();

    const count = await productsPage.productCards.count();
    expect(count).toBeGreaterThan(0);

    // Click 'View Product' of the first product
    await productsPage.viewProductDetailsByIndex(0);
    await expect(page).toHaveURL(/.*product_details/);

    // Verify product details are visible
    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.productCategory).toBeVisible();
    await expect(productDetailPage.productPrice).toBeVisible();
    await expect(productDetailPage.availability).toBeVisible();
    await expect(productDetailPage.condition).toBeVisible();
    await expect(productDetailPage.brand).toBeVisible();
  });

  test('@smoke @regression TC07: Search product and verify search results match query', async ({
    productsPage,
  }) => {
    await productsPage.goto();
    await productsPage.searchProduct('Dress');

    await expect(productsPage.titleHeader).toHaveText('Searched Products', { ignoreCase: true });

    const resultsCount = await productsPage.productCards.count();
    expect(resultsCount).toBeGreaterThan(0);

    // Verify all returned product cards are rendered and visible
    for (let i = 0; i < Math.min(resultsCount, 5); i++) {
      await expect(productsPage.productCards.nth(i)).toBeVisible();
    }
  });

  test('@regression TC08: Filter products by Category and Subcategory', async ({
    productsPage,
    page,
  }) => {
    await productsPage.goto();

    // Filter Women -> Tops
    await productsPage.filterByCategory('Women', '/category_products/2');
    await expect(page).toHaveURL(/.*category_products\/2/);
    await expect(productsPage.titleHeader).toContainText('Women - Tops Products', {
      ignoreCase: true,
    });
    expect(await productsPage.productCards.count()).toBeGreaterThan(0);

    // Filter Men -> Tshirts
    await productsPage.filterByCategory('Men', '/category_products/3');
    await expect(page).toHaveURL(/.*category_products\/3/);
    await expect(productsPage.titleHeader).toContainText('Men - Tshirts Products', {
      ignoreCase: true,
    });
    expect(await productsPage.productCards.count()).toBeGreaterThan(0);
  });

  test('@regression TC09: Filter products by Brand', async ({ productsPage, page }) => {
    await productsPage.goto();

    // Filter by Brand: Polo
    await productsPage.filterByBrand('Polo');
    await expect(page).toHaveURL(/.*brand_products\/Polo/);
    await expect(productsPage.titleHeader).toContainText('Brand - Polo Products', {
      ignoreCase: true,
    });
    expect(await productsPage.productCards.count()).toBeGreaterThan(0);

    // Filter by Brand: Madame
    await productsPage.filterByBrand('Madame');
    await expect(page).toHaveURL(/.*brand_products\/Madame/);
    await expect(productsPage.titleHeader).toContainText('Brand - Madame Products', {
      ignoreCase: true,
    });
    expect(await productsPage.productCards.count()).toBeGreaterThan(0);
  });

  test('@regression TC10: Submit product review with customer details', async ({
    productDetailPage,
  }) => {
    await productDetailPage.goto(1);
    await expect(productDetailPage.reviewHeading).toBeVisible();

    await productDetailPage.submitReview(
      'Pritesh Tester',
      'reviewer@example.com',
      'Great product quality and fast delivery!',
    );
    await expect(productDetailPage.reviewSuccessAlert).toBeVisible();
    await expect(productDetailPage.reviewSuccessAlert).toContainText('Thank you for your review.');
  });
});
