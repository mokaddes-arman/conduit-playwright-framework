import { Page, Locator } from '@playwright/test';

export class ArticlePage {
  readonly page: Page;
  readonly title: Locator;
  readonly body: Locator;
  readonly tagPills: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly authorLink: Locator;
  readonly date: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.body = page.locator('.row.article-content p');
    this.tagPills = page.locator('li.tag-default.tag-pill.tag-outline');
    this.editButton = page.locator('a.btn-outline-secondary', { hasText: 'Edit Article' }).first();
    this.deleteButton = page.locator('button.btn-outline-danger', { hasText: 'Delete Article' }).first();
    this.authorLink = page.locator('a.author');
    this.date = page.locator('span.date');
  }

  async goto(slug: string) {
    await this.page.goto(`/article/${slug}`);
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }
}