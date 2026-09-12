import { Page, Locator } from '@playwright/test';

export class EditorPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;
  readonly tagPills: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.locator('[formcontrolname="title"]');
    this.descriptionInput = page.locator('[formcontrolname="description"]');
    this.bodyInput = page.locator('[formcontrolname="body"]');
    this.tagsInput = page.locator('input[type="text"][placeholder="Enter tags"]');
    this.publishButton = page.locator('button[type="button"]', { hasText: 'Publish Article' });
    this.tagPills = page.locator('span.tag-default.tag-pill');
    this.errorMessages = page.locator('app-list-errors .error-messages li');
  }

  async goto() {
    await this.page.goto('/editor');
  }

  async gotoEdit(slug: string) {
    await this.page.goto(`/editor/${slug}`);
  }

  async fillArticleForm(article: {
    title: string;
    description: string;
    body: string;
    tags?: string[];
  }) {
    await this.titleInput.fill(article.title);
    await this.descriptionInput.fill(article.description);
    await this.bodyInput.fill(article.body);

    if (article.tags?.length) {
      for (const tag of article.tags) {
        await this.tagsInput.fill(tag);
        await this.tagsInput.press('Enter');
      }
    }
  }

  async publish() {
    await this.publishButton.click();
  }
}