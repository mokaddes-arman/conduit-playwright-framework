import { test, expect } from '@playwright/test';
import { SettingsPage } from '../../pages/SettingsPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { generateUserSettings } from '../../utils/test-data-generator';

test.describe.configure({ mode: 'serial' });

test.describe('Update User Settings', () => {
  test('should update bio and profile image successfully', async ({ page }) => {
    const settingsPage = new SettingsPage(page);
    const profilePage = new ProfilePage(page);
    const newSettings = generateUserSettings();

    await settingsPage.goto();
    await settingsPage.updateSettings({ bio: newSettings.bio, image: newSettings.image });

    // assert redirect to profile page
    await expect(page).toHaveURL(/\/profile\/.+/);

    // assert new bio and image are shown
    await expect(profilePage.bio).toHaveText(newSettings.bio);
    await expect(profilePage.profileImage).toHaveAttribute('src', newSettings.image);

    // re-navigate fresh to confirm persistence, not just client-side state
    const url = page.url();
    await page.goto(url);
    await expect(profilePage.bio).toHaveText(newSettings.bio);
    await expect(profilePage.profileImage).toHaveAttribute('src', newSettings.image);
  });

  test('should not update username to an empty value', async ({ page }) => {
    const settingsPage = new SettingsPage(page);
    const profilePage = new ProfilePage(page);

    const originalUsername = process.env.TEST_USERNAME!;

    await settingsPage.goto();
    await settingsPage.updateSettings({ username: '' });

    // redirect still happens...
    await expect(page).toHaveURL(/\/profile\/.+/);

    // ...but username remains unchanged
    await expect(profilePage.username).toHaveText(originalUsername);
  });
});