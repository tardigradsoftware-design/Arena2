import {expect, test} from '@playwright/test';

test('the composition previews in a real Chromium browser', async ({page}, testInfo) => {
  await page.goto('/preview.html');
  await expect(page).toHaveTitle(/Arena Motion Lab/);
  await expect(page.getByRole('heading', {name: 'Görseli harekete geçir.'})).toBeVisible();
  await expect(page.getByText('ARENA MOTION LAB')).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath('studio-intro-browser.png'),
    fullPage: true,
  });
});
