import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Filter Articles by Tag', () => {
    test('should filter articles by selected tag', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        const tagCount = await homePage.popularTags.count();
        const randomIndex = Math.floor(Math.random() * tagCount);
        const randomTagLocator = homePage.popularTags.nth(randomIndex);
        const selectedTag = (await randomTagLocator.textContent())!.trim();

        await test.step(`Filtering by tag: ${selectedTag}`, async () => {
            await randomTagLocator.click();
        });

        // the tag-tab should appear and become active, showing the selected tag's name
        await expect(homePage.tagFeedTab).toHaveClass(/active/);
        await expect(homePage.tagFeedTab).toHaveText(selectedTag);

        // every visible article preview should contain that tag
        const count = await homePage.articlePreviews.count();
        for (let i = 0; i < count; i++) {
            const tagsForArticle = await homePage.getTagsForArticle(i);
            await expect(tagsForArticle.filter({ hasText: selectedTag })).toHaveCount(1);
        }
    });

    test('should clear the tag filter when switching back to Global Feed', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        const tagCount = await homePage.popularTags.count();
        const randomIndex = Math.floor(Math.random() * tagCount);
        const randomTagLocator = homePage.popularTags.nth(randomIndex);
        const selectedTag = (await randomTagLocator.textContent())!.trim();

        await test.step(`Filtering by tag: ${selectedTag}`, async () => {
            await randomTagLocator.click();
        });

        await expect(homePage.tagFeedTab).toHaveClass(/active/);
        await expect(homePage.tagFeedTab).toHaveText(selectedTag);

        await test.step('Switching back to Global Feed', async () => {
            await homePage.globalFeedTab.click();
        });

        await expect(homePage.globalFeedTab).toHaveClass(/active/);
        await expect(homePage.tagFeedTab).toBeHidden();
    });
});