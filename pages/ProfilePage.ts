import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly username: Locator;
  readonly bio: Locator;
  readonly profileImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator('.user-info h4');
    this.bio = page.locator('.user-info p');
    this.profileImage = page.locator('.user-info img.user-img');
  }

  async goto(username: string) {
    await this.page.goto(`/profile/${username}`);
  }
}