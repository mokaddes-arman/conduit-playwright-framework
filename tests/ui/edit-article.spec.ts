import { test, expect } from '@playwright/test';
import { EditorPage } from '../../pages/EditorPage';
import { ArticlePage } from '../../pages/ArticlePage';
import { createArticle } from '../../utils/api-helper';
import { generateArticle } from '../../utils/test-data-generator';
import tokenData from '../../playwright/.auth/token.json';

test.describe('Edit Article', () => {
    test('should edit an existing article with valid data', async ({ page, request }) => {
        const editorPage = new EditorPage(page);
        const articlePage = new ArticlePage(page);

        // precondition: create article via API
        const seedData = generateArticle();
        const original = await createArticle(request, tokenData.token, {
            title: seedData.title,
            description: seedData.description,
            body: seedData.body,
            tagList: seedData.tags,
        });

        const updated = generateArticle();

        await editorPage.gotoEdit(original.slug);
        await editorPage.fillArticleForm(updated);
        await editorPage.publish();

        await expect(page).toHaveURL(/\/article\/.+/);
        await expect(articlePage.title).toHaveText(updated.title);
        await expect(articlePage.body).toHaveText(updated.body);

        for (const tag of updated.tags) {
            await expect(articlePage.tagPills.filter({ hasText: tag })).toBeVisible();
        }

        const newUrl = page.url();
        await page.goto(newUrl);
        await expect(articlePage.title).toHaveText(updated.title);
    });

    test('should not save an edit with an empty title', async ({ page, request }) => {
        const editorPage = new EditorPage(page);
        const articlePage = new ArticlePage(page);

        const seedData = generateArticle();
        const original = await createArticle(request, tokenData.token, {
            title: seedData.title,
            description: seedData.description,
            body: seedData.body,
            tagList: seedData.tags,
        });

        await editorPage.gotoEdit(original.slug);

        // wait for the form to finish loading the existing article's data
        await expect(editorPage.titleInput).toHaveValue(original.title);

        await editorPage.titleInput.fill('');
        await editorPage.publish();

        await expect(page).toHaveURL(/\/article\/.+/);
        await expect(articlePage.title).toHaveText(original.title);

        await page.goto(`/article/${original.slug}`);
        await expect(articlePage.title).toHaveText(original.title);
    });
});