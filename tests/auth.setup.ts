import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');
const tokenFile = path.join(__dirname, '../playwright/.auth/token.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');

  await page.locator('[formcontrolname="email"]').fill(process.env.TEST_USER_EMAIL!);
  await page.locator('[formcontrolname="password"]').fill(process.env.TEST_USER_PASSWORD!);
  await page.locator('[type="submit"]').click();

  await expect(page.getByText(process.env.TEST_USERNAME!)).toBeVisible();

  await page.context().storageState({ path: authFile });

  const token = await page.evaluate(() => window.localStorage.getItem('jwtToken'));
  fs.writeFileSync(tokenFile, JSON.stringify({ token }));
});