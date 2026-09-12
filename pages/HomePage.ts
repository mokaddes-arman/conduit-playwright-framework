import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly popularTags: Locator;
  readonly articlePreviews: Locator;
  readonly articlePreviewLinks: Locator;
  readonly feedTabs: Locator;
  readonly activeFeedTab: Locator;
  readonly yourFeedTab: Locator;
  readonly globalFeedTab: Locator;
  readonly tagFeedTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popularTags = page.locator('.sidebar .tag-list a.tag-default.tag-pill');
    this.articlePreviews = page.locator('app-article-preview');
    this.articlePreviewLinks = page.locator('a.preview-link');

    this.feedTabs = page.locator('ul.nav-pills li.nav-item a.nav-link');
    this.activeFeedTab = page.locator('ul.nav-pills li.nav-item a.nav-link.active');
    this.yourFeedTab = page.locator('a.nav-link', { hasText: 'Your Feed' });
    this.globalFeedTab = page.locator('a.nav-link', { hasText: 'Global Feed' });
    this.tagFeedTab = page.locator('ul.nav-pills li.nav-item:not(:has-text("Your Feed")):not(:has-text("Global Feed")) a.nav-link');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickTag(tagName: string) {
    await this.popularTags.filter({ hasText: tagName }).click();
  }

  async getTagsForArticle(index: number) {
    return this.articlePreviews.nth(index).locator('li.tag-default.tag-pill.tag-outline');
  }
}