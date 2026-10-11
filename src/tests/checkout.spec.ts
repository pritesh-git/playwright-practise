import { test, expect } from '../fixtures/test-base';
import { generateRandomUser, defaultPaymentData } from '../utils/test-data';

test.describe('End-to-End Checkout & Payment Suite', () => {
  test('@smoke @regression TC15: Complete checkout workflow with address verification and payment', async ({
    authPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
    page,
  }) => {
    const user = generateRandomUser();

    // 1. Register new user
    await authPage.registerFullAccount(user);
    await expect(authPage.loggedInUserText).toBeVisible();

    // 2. Add product to cart
    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0, false);

    // 3. Review cart and proceed to checkout
    await expect(page).toHaveURL(/.*view_cart/);
    await cartPage.proceedToCheckout();

    // 4. Address Details Verification on Checkout Page
    await expect(page).toHaveURL(/.*checkout/);
    await expect(checkoutPage.deliveryAddress).toBeVisible();
    await expect(checkoutPage.deliveryAddress).toContainText(`${user.firstName} ${user.lastName}`);
    await expect(checkoutPage.deliveryAddress).toContainText(user.company);
    await expect(checkoutPage.deliveryAddress).toContainText(user.address1);
    await expect(checkoutPage.deliveryAddress).toContainText(user.city);
    await expect(checkoutPage.deliveryAddress).toContainText(user.state);
    await expect(checkoutPage.deliveryAddress).toContainText(user.zipcode);
    await expect(checkoutPage.deliveryAddress).toContainText(user.country);
    await expect(checkoutPage.deliveryAddress).toContainText(user.mobileNumber);

    // 5. Enter order comment and place order
    await checkoutPage.enterComment('Please ring doorbell upon delivery.');
    await checkoutPage.placeOrder();

    // 6. Payment simulation
    await expect(page).toHaveURL(/.*payment/);
    await paymentPage.payAndConfirm(defaultPaymentData);

    // 7. Order Confirmation verification
    await expect(paymentPage.orderPlacedTitle).toBeVisible();
    await expect(paymentPage.orderSuccessMessage).toBeVisible();

    // 8. Download Invoice verification
    const downloadPromise = page.waitForEvent('download');
    await paymentPage.downloadInvoiceBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('invoice');

    // 9. Cleanup: Delete account
    await paymentPage.continueBtn.click();
    await authPage.deleteAccountAndContinue();
  });

  test('@regression TC16: Place Order: Login before Checkout', async ({
    authPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
    page,
  }) => {
    const user = generateRandomUser();

    // Register user then logout
    await authPage.registerFullAccount(user);
    await authPage.logout();

    // Login prior to shopping
    await authPage.login(user.email, user.password);
    await expect(authPage.loggedInUserText).toBeVisible();

    // Add item to cart
    await productsPage.goto();
    await productsPage.addProductToCartByIndex(1, false);

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout/);

    // Enter comment & place order
    await checkoutPage.enterComment('Order placed after login.');
    await checkoutPage.placeOrder();

    // Submit payment
    await paymentPage.payAndConfirm(defaultPaymentData);
    await expect(paymentPage.orderPlacedTitle).toBeVisible();

    // Cleanup
    await paymentPage.continueBtn.click();
    await authPage.deleteAccountAndContinue();
  });

  test('@regression TC17: Place Order: Register while Checkout as guest', async ({
    productsPage,
    cartPage,
    authPage,
    checkoutPage,
    paymentPage,
    page,
  }) => {
    const user = generateRandomUser();

    // 1. As guest, add item to cart
    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0, false);
    await expect(page).toHaveURL(/.*view_cart/);

    // 2. Click proceed to checkout and trigger modal
    await cartPage.proceedToCheckout();
    try {
      await expect(cartPage.checkoutModal).toHaveClass(/show/, { timeout: 3000 });
    } catch {
      await cartPage.proceedToCheckout();
      await expect(cartPage.checkoutModal).toHaveClass(/show/);
    }

    // 3. Click Register / Login in modal
    await cartPage.checkoutModalRegisterLoginLink.click({ force: true });
    await expect(page).toHaveURL(/.*login/);

    // 4. Complete registration
    await authPage.initiateSignup(user.name, user.email);
    await authPage.fillRegistrationForm(user);
    await expect(authPage.accountCreatedTitle).toBeVisible();
    await authPage.continueBtn.click();
    await expect(authPage.loggedInUserText).toBeVisible();

    // 5. Navigate back to cart and proceed
    await authPage.navCart.click();
    await expect(page).toHaveURL(/.*view_cart/);
    await cartPage.proceedToCheckout();

    // 6. Verify checkout page & submit order
    await expect(page).toHaveURL(/.*checkout/);
    await checkoutPage.enterComment('Checkout completed after guest registration.');
    await checkoutPage.placeOrder();

    // 7. Complete payment
    await paymentPage.payAndConfirm(defaultPaymentData);
    await expect(paymentPage.orderPlacedTitle).toBeVisible();

    // Cleanup
    await paymentPage.continueBtn.click();
    await authPage.deleteAccountAndContinue();
  });
});
