import { test, expect } from '../fixtures/test-base';
import * as path from 'path';
import { generateContactUsData } from '../utils/test-data';

test.describe('Routes, Navigation & Page Content Suite', () => {
  test('@smoke @regression TC18: Home page elements verification (Carousel, Categories, Featured, Recommended, Footer)', async ({
    homePage,
  }) => {
    await homePage.goto();

    // 1. Carousel Slider
    await expect(homePage.sliderCarousel).toBeVisible();
    await expect(homePage.carouselIndicators.first()).toBeVisible();
    await expect(homePage.carouselInner).toBeVisible();
    await expect(homePage.carouselActiveHeading).toBeVisible();
    await expect(homePage.carouselPrevBtn).toBeVisible();
    await expect(homePage.carouselNextBtn).toBeVisible();

    // 2. Category Sidebar
    await expect(homePage.categorySidebar).toBeVisible();
    await expect(homePage.categoryWomenHeading).toBeVisible();
    await expect(homePage.categoryMenHeading).toBeVisible();
    await expect(homePage.categoryKidsHeading).toBeVisible();

    // 3. Featured Items Grid
    await expect(homePage.featuredItemsTitle).toBeVisible();
    await expect(homePage.featuredProducts.first()).toBeVisible();
    expect(await homePage.featuredProducts.count()).toBeGreaterThan(0);

    // 4. Recommended Items Carousel
    await homePage.recommendedItemsTitle.scrollIntoViewIfNeeded();
    await expect(homePage.recommendedItemsTitle).toBeVisible();
    await expect(homePage.recommendedProducts.first()).toBeVisible();
    await expect(homePage.recommendedPrevBtn).toBeVisible();
    await expect(homePage.recommendedNextBtn).toBeVisible();

    // 5. Footer Newsletter Subscription
    const testEmail = `sub_home_${Date.now()}@example.com`;
    await homePage.subscribeNewsletter(testEmail);
    await expect(homePage.subscriptionSuccessAlert).toBeVisible();
    await expect(homePage.subscriptionSuccessAlert).toHaveText(
      /You have been successfully subscribed!/,
    );
  });

  test('@regression TC19: Verify Subscription in Cart page', async ({ cartPage }) => {
    await cartPage.goto();
    const testEmail = `sub_cart_${Date.now()}@example.com`;
    await cartPage.subscribeNewsletter(testEmail);
    await expect(cartPage.subscriptionSuccessAlert).toBeVisible();
    await expect(cartPage.subscriptionSuccessAlert).toHaveText(
      /You have been successfully subscribed!/,
    );
  });

  test('@smoke @regression TC20: Contact Us form submission with file attachment and dialog alert', async ({
    contactPage,
    page,
  }) => {
    const contactData = generateContactUsData({
      filePath: path.resolve(__dirname, '../fixtures/sample-upload.txt'),
    });

    await contactPage.goto();
    await expect(contactPage.contactHeading).toBeVisible();

    await contactPage.fillForm(contactData);
    await contactPage.submitWithDialogAccept();

    await expect(contactPage.successAlert).toBeVisible();
    await expect(contactPage.successAlert).toHaveText(
      /Success! Your details have been submitted successfully./,
    );

    // Click Home button and verify landing back on home page
    await contactPage.homeBtn.click();
    await expect(page).toHaveURL(/.*automationexercise\.com\/?$/);
  });

  test('@regression TC21: Verify Test Cases page scenarios list', async ({ staticPages, page }) => {
    await staticPages.gotoTestCases();
    await expect(page).toHaveURL(/.*test_cases/);
    await expect(staticPages.testCasesHeading).toBeVisible();

    const testCaseCount = await staticPages.testCasePanels.count();
    expect(testCaseCount).toBeGreaterThanOrEqual(15);
  });

  test('@regression TC22: Verify API Testing documentation page', async ({ staticPages, page }) => {
    await staticPages.gotoApiList();
    await expect(page).toHaveURL(/.*api_list/);
    await expect(staticPages.apisHeading).toBeVisible();

    const apisCount = await staticPages.apiPanels.count();
    expect(apisCount).toBeGreaterThanOrEqual(10);
  });

  test('@regression TC23: Verify Video Tutorials external navigation link', async ({
    homePage,
  }) => {
    await homePage.goto();
    await expect(homePage.navVideoTutorials).toBeVisible();

    const href = await homePage.navVideoTutorials.getAttribute('href');
    expect(href).toContain('youtube.com');
  });
});
