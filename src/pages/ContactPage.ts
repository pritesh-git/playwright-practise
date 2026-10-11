import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ContactUsData } from '../utils/test-data';

export class ContactPage extends BasePage {
  readonly contactHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly fileUploadInput: Locator;
  readonly submitBtn: Locator;
  readonly successAlert: Locator;
  readonly homeBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.contactHeading = page.locator('.contact-form h2.title:has-text("Get In Touch")');
    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageInput = page.locator('[data-qa="message"]');
    this.fileUploadInput = page.locator('input[name="upload_file"]');
    this.submitBtn = page.locator('[data-qa="submit-button"]');
    this.successAlert = page.locator('.status.alert-success');
    this.homeBtn = page.locator('#form-section a.btn-success');
  }

  async goto() {
    await this.page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
  }

  async fillForm(data: ContactUsData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageInput.fill(data.message);
    if (data.filePath) {
      await this.fileUploadInput.setInputFiles(data.filePath);
    }
  }

  async submitWithDialogAccept() {
    // Site displays native window.confirm alert when clicking submit
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.submitBtn.click();
  }
}
