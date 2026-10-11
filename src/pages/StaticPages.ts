import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class StaticPages extends BasePage {
  // Test Cases Page (/test_cases)
  readonly testCasesHeading: Locator;
  readonly testCasePanels: Locator;

  // API Testing Page (/api_list)
  readonly apisHeading: Locator;
  readonly apiPanels: Locator;

  constructor(page: Page) {
    super(page);

    this.testCasesHeading = page.locator('h2.title:has-text("Test Cases")');
    this.testCasePanels = page.locator('.panel-group .panel-heading');

    this.apisHeading = page.locator('h2.title:has-text("APIs List for practice")');
    this.apiPanels = page.locator('.panel-group .panel-heading');
  }

  async gotoTestCases() {
    await this.page.goto('/test_cases', { waitUntil: 'domcontentloaded' });
  }

  async gotoApiList() {
    await this.page.goto('/api_list', { waitUntil: 'domcontentloaded' });
  }
}
