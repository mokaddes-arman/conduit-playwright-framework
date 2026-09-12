import { test, expect } from '@playwright/test';
import { EditorPage } from '../../pages/EditorPage';
import { ArticlePage } from '../../pages/ArticlePage';
import { generateArticle } from '../../utils/test-data-generator';

test.describe('Create Article', () => {
  test('should create a new article with valid data', async ({ page }) => {
    const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page);
    const article = generateArticle();

    await editorPage.goto();
    await editorPage.fillArticleForm(article);
    await editorPage.publish();

    // assert redirect to the new article's page
    await expect(page).toHaveURL(/\/article\/.+/);

    // assert content persisted correctly
    await expect(articlePage.title).toHaveText(article.title);
    await expect(articlePage.body).toHaveText(article.body);

    // assert tags were saved and displayed
    for (const tag of article.tags) {
      await expect(articlePage.tagPills.filter({ hasText: tag })).toBeVisible();
    }

    // re-navigate fresh to confirm persistence, not just client-side state
    const url = page.url();
    await page.goto(url);
    await expect(articlePage.title).toHaveText(article.title);
    await expect(articlePage.body).toHaveText(article.body);
  });

  test('should not create an article with empty required fields', async ({ page }) => {
    const editorPage = new EditorPage(page);

    await editorPage.goto();
    await editorPage.publish(); // submit with everything blank

    // should stay on the editor, not navigate to a new article
    await expect(page).toHaveURL(/\/editor/);

    // should show exactly one validation error, with the expected text
    await expect(editorPage.errorMessages).toHaveCount(1);
    await expect(editorPage.errorMessages).toHaveText("title can't be blank");
  });
});