import { Page, Locator } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly imageInput: Locator;
  readonly usernameInput: Locator;
  readonly bioInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly updateButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.imageInput = page.locator('[formcontrolname="image"]');
    this.usernameInput = page.locator('[formcontrolname="username"]');
    this.bioInput = page.locator('[formcontrolname="bio"]');
    this.emailInput = page.locator('[formcontrolname="email"]');
    this.passwordInput = page.locator('[formcontrolname="password"]');
    this.updateButton = page.locator('button[type="submit"]');
    this.logoutButton = page.locator('button.btn-outline-danger');
  }

  async goto() {
    await this.page.goto('/settings');
  }

  async updateSettings(fields: {
    image?: string;
    username?: string;
    bio?: string;
    email?: string;
    password?: string;
  }) {
    if (fields.image !== undefined) await this.imageInput.fill(fields.image);
    if (fields.username !== undefined) await this.usernameInput.fill(fields.username);
    if (fields.bio !== undefined) await this.bioInput.fill(fields.bio);
    if (fields.email !== undefined) await this.emailInput.fill(fields.email);
    if (fields.password !== undefined) await this.passwordInput.fill(fields.password);

    await this.updateButton.click();
  }
}