import { test, expect } from '../fixtures/test-base';

test.describe('Shopping Cart Suite', () => {
  test('@smoke @regression TC11: Add products from catalog to cart and verify items', async ({
    productsPage,
    cartPage,
    page,
  }) => {
    await productsPage.goto();

    // Add 1st product to cart, continue shopping
    await productsPage.addProductToCartByIndex(0, true);

    // Add 2nd product to cart, view cart
    await productsPage.addProductToCartByIndex(1, false);

    await expect(page).toHaveURL(/.*view_cart/);
    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThanOrEqual(2);

    // Verify row components (price, quantity, total)
    const firstRow = cartPage.cartRows.first();
    await expect(firstRow.locator('.cart_description')).toBeVisible();
    await expect(firstRow.locator('.cart_price')).toBeVisible();
    await expect(firstRow.locator('.cart_quantity')).toBeVisible();
    await expect(firstRow.locator('.cart_total')).toBeVisible();
  });

  test('@regression TC12: Verify exact product quantity in cart from product detail page', async ({
    productDetailPage,
    cartPage,
    page,
  }) => {
    await productDetailPage.goto(1);

    // Set quantity to 4
    await productDetailPage.setQuantity(4);
    await productDetailPage.addToCart(true);

    await expect(page).toHaveURL(/.*view_cart/);
    const firstRow = cartPage.cartRows.first();
    const qtyText = await firstRow.locator('.cart_quantity button').innerText();
    expect(qtyText.trim()).toBe('4');
  });

  test('@regression TC13: Remove product from cart and assert deletion', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0, false);

    const initialCount = await cartPage.getItemCount();
    expect(initialCount).toBeGreaterThan(0);

    // Delete first item
    await cartPage.deleteItemByIndex(0);

    // Assert item count decreased or empty cart shown
    await expect(async () => {
      const updatedCount = await cartPage.cartRows.count();
      const isEmpty = await cartPage.emptyCartMessage.isVisible();
      expect(updatedCount < initialCount || isEmpty).toBeTruthy();
    }).toPass({ timeout: 10000 });
  });

  test('@regression TC14: Add recommended item to cart from Home page', async ({
    homePage,
    cartPage,
    page,
  }) => {
    await homePage.goto();
    await homePage.recommendedItemsTitle.scrollIntoViewIfNeeded();
    await expect(homePage.recommendedItemsTitle).toBeVisible();

    await homePage.addRecommendedProductToCart(0, false);
    await expect(page).toHaveURL(/.*view_cart/);
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);
  });
});
