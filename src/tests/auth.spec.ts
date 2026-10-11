import { test, expect } from '../fixtures/test-base';
import { generateRandomUser } from '../utils/test-data';

test.describe('Authentication & User Lifecycle Suite', () => {
  test('@smoke @regression TC01: Register user with dynamic details and delete account', async ({
    authPage,
  }) => {
    const user = generateRandomUser();

    await authPage.goto();
    await expect(authPage.signupTitle).toBeVisible();

    await authPage.initiateSignup(user.name, user.email);
    await authPage.fillRegistrationForm(user);

    await expect(authPage.accountCreatedTitle).toBeVisible();
    await authPage.continueBtn.click();

    await expect(authPage.loggedInUserText).toBeVisible();
    await expect(authPage.loggedInUserText).toContainText(user.name);

    // Delete account
    await authPage.deleteAccountAndContinue();
    await expect(authPage.loggedInUserText).toBeHidden();
  });

  test('@smoke @regression TC02: Login with valid credentials and verify user session', async ({
    authPage,
  }) => {
    const user = generateRandomUser();

    // Setup: create user account first
    await authPage.registerFullAccount(user);
    await authPage.logout();

    // Action: Login
    await authPage.login(user.email, user.password);

    // Assert: Logged in successfully
    await expect(authPage.loggedInUserText).toBeVisible();
    await expect(authPage.loggedInUserText).toContainText(user.name);

    // Cleanup
    await authPage.deleteAccountAndContinue();
  });

  test('@regression TC03: Negative login with invalid email and password', async ({ authPage }) => {
    await authPage.goto();
    await authPage.login('nonexistent_user_9999@example.com', 'InvalidPassword123');

    await expect(authPage.loginErrorMessage).toBeVisible();
    await expect(authPage.loginErrorMessage).toContainText('Your email or password is incorrect!');
  });

  test('@regression TC04: Register with already existing email shows error', async ({
    authPage,
  }) => {
    const user = generateRandomUser();

    // Register user
    await authPage.registerFullAccount(user);
    await authPage.logout();

    // Try registering with same email
    await authPage.goto();
    await authPage.initiateSignup('Duplicate Name', user.email);

    await expect(authPage.signupErrorMessage).toBeVisible();
    await expect(authPage.signupErrorMessage).toContainText('Email Address already exist!');

    // Cleanup: log back in and delete
    await authPage.login(user.email, user.password);
    await authPage.deleteAccountAndContinue();
  });

  test('@regression TC05: User logout terminates authenticated session', async ({
    authPage,
    page,
  }) => {
    const user = generateRandomUser();

    await authPage.registerFullAccount(user);
    await expect(authPage.loggedInUserText).toBeVisible();

    await authPage.logout();
    await expect(page).toHaveURL(/.*login/);
    await expect(authPage.loginTitle).toBeVisible();

    // Clean up
    await authPage.login(user.email, user.password);
    await authPage.deleteAccountAndContinue();
  });
});
