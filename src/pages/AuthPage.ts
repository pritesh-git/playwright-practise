import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserRegistrationData } from '../utils/test-data';

export class AuthPage extends BasePage {
  // Login Section
  readonly loginTitle: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitBtn: Locator;
  readonly loginErrorMessage: Locator;

  // New User Signup Section
  readonly signupTitle: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupSubmitBtn: Locator;
  readonly signupErrorMessage: Locator;

  // Account Information Registration Form (/signup)
  readonly accountInfoTitle: Locator;
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly optinCheckbox: Locator;

  // Address Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountBtn: Locator;

  // Confirmation Screens
  readonly accountCreatedTitle: Locator;
  readonly accountDeletedTitle: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.loginTitle = page.locator('.login-form h2');
    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginSubmitBtn = page.locator('[data-qa="login-button"]');
    this.loginErrorMessage = page.locator('form[action="/login"] p');

    this.signupTitle = page.locator('.signup-form h2');
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupSubmitBtn = page.locator('[data-qa="signup-button"]');
    this.signupErrorMessage = page.locator('form[action="/signup"] p');

    this.accountInfoTitle = page.locator('h2:has-text("Enter Account Information")');
    this.titleMrRadio = page.locator('#id_gender1');
    this.titleMrsRadio = page.locator('#id_gender2');
    this.passwordInput = page.locator('#password');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');

    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountBtn = page.locator('[data-qa="create-account"]');

    this.accountCreatedTitle = page.locator('[data-qa="account-created"]');
    this.accountDeletedTitle = page.locator('[data-qa="account-deleted"]');
    this.continueBtn = page.locator('[data-qa="continue-button"]');
  }

  async goto() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, pass: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(pass);
    await this.loginSubmitBtn.click();
  }

  async initiateSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupSubmitBtn.click();
  }

  async fillRegistrationForm(userData: UserRegistrationData) {
    await expect(this.accountInfoTitle).toBeVisible();

    if (userData.title === 'Mr') {
      await this.titleMrRadio.check();
    } else {
      await this.titleMrsRadio.check();
    }

    await this.passwordInput.fill(userData.password);
    await this.daysSelect.selectOption(userData.birthDay);
    await this.monthsSelect.selectOption(userData.birthMonth);
    await this.yearsSelect.selectOption(userData.birthYear);

    if (userData.newsletter) {
      await this.newsletterCheckbox.check();
    }
    if (userData.specialOffers) {
      await this.optinCheckbox.check();
    }

    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.companyInput.fill(userData.company);
    await this.address1Input.fill(userData.address1);
    if (userData.address2) {
      await this.address2Input.fill(userData.address2);
    }
    await this.countrySelect.selectOption(userData.country);
    await this.stateInput.fill(userData.state);
    await this.cityInput.fill(userData.city);
    await this.zipcodeInput.fill(userData.zipcode);
    await this.mobileNumberInput.fill(userData.mobileNumber);

    await this.createAccountBtn.click();
  }

  async registerFullAccount(userData: UserRegistrationData) {
    await this.goto();
    await this.initiateSignup(userData.name, userData.email);
    await this.fillRegistrationForm(userData);
    await expect(this.accountCreatedTitle).toBeVisible();
    await this.continueBtn.click();
  }
}
