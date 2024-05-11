const { test, expect } = require('@playwright/test');

test('Basic Split Calculator usage', async ({ page }) => {
  await page.goto('/');

  // Go to split calculator
  await page.getByRole('button', { name: 'Split Calculator' }).click();
  await expect(page).toHaveTitle('Split Calculator - Running Tools');

  // Enter input 5K splits (7:00, 6:30, 6:30)
  await page.getByLabel('Split duration minutes').nth(0).fill('7');
  await page.getByLabel('Split duration seconds').nth(0).fill('0');
  await page.getByLabel('Split duration minutes').nth(1).fill('6');
  await page.getByLabel('Split duration seconds').nth(1).fill('30');
  await page.getByLabel('Split duration minutes').nth(2).fill('6');
  await page.getByLabel('Split duration seconds').nth(2).fill('30');

  // Assert times are correct
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(1)).toHaveText('7:00.00');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(1)).toHaveText('13:30.00');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(1)).toHaveText('20:00.00');

  // Assert paces are correct
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('7:00 / mi');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('6:30 / mi');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(3)).toHaveText('5:52 / mi');

  // Change default units
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Assert paces are correct
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('4:21 / km');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('4:02 / km');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(3)).toHaveText('3:39 / km');
});
