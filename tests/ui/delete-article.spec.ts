import { test, expect } from '@playwright/test';
import { ArticlePage } from '../../pages/ArticlePage';
import { createArticle } from '../../utils/api-helper';
import { generateArticle } from '../../utils/test-data-generator';
import fs from 'fs';
import path from 'path';

let tokenData: any;

test.beforeAll(async () => {
  const tokenPath = path.join(__dirname, '../../playwright/.auth/token.json');
  if (!fs.existsSync(tokenPath)) {
    throw new Error(`Authentication token not found at ${tokenPath}. Run setup tests first.`);
  }
  tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
});

test.describe('Delete Article', () => {
  test('should delete an existing article', async ({ page, request }) => {
    const articlePage = new ArticlePage(page);
    // precondition: create article via API
    const seedData = generateArticle();
    const created = await createArticle(request, tokenData.token, {
      title: seedData.title,
      description: seedData.description,
      body: seedData.body,
      tagList: seedData.tags,
    });

    await articlePage.goto(created.slug);
    await expect(articlePage.title).toHaveText(created.title); // sanity check it exists first

    await articlePage.clickDelete();

    // assert redirect to home page
    await expect(page).toHaveURL('/');

    // assert the deleted article no longer resolves — app auto-redirects to home on 404
    await page.goto(`/article/${created.slug}`);
    await expect(page).toHaveURL('/');
  });

  test('should not find a deleted article when accessed directly afterward', async ({ page, request }) => {
    const articlePage = new ArticlePage(page);

    const seedData = generateArticle();
    const created = await createArticle(request, tokenData.token, {
      title: seedData.title,
      description: seedData.description,
      body: seedData.body,
      tagList: seedData.tags,
    });

    await articlePage.goto(created.slug);
    await articlePage.clickDelete();
    await expect(page).toHaveURL('/');

    // simulate someone hitting the old URL directly (e.g. a stale bookmark/link)
    await page.goto(`/article/${created.slug}`);

    // app should redirect to home rather than showing a broken page
    await expect(page).toHaveURL('/');
  });
});
