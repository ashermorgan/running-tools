const { test, expect } = require('@playwright/test');

test('Basic Pace Calculator usage', async ({ page }) => {
  await page.goto('/');

  // Go to pace calculator
  await page.getByRole('button', { name: 'Pace Calculator' }).click();
  await expect(page).toHaveTitle('Pace Calculator - Running Tools');

  // Enter input pace (2 mi in 15:30)
  await page.getByLabel('Input distance value').fill('2');
  await page.getByLabel('Input distance unit').selectOption('Miles');
  await page.getByLabel('Input duration hours').fill('0');
  await page.getByLabel('Input duration minutes').fill('15');
  await page.getByLabel('Input duration seconds').fill('30');

  // Assert paces are correct
  await expect(page.getByRole('row').nth(11)).toHaveText('1 mi' + '7:45.00');
  await expect(page.getByRole('row').nth(13)).toHaveText('1.29 mi' + '10:00');

  // Change default units
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Assert paces are correct
  await expect(page.getByRole('row').nth(11)).toHaveText('1 mi' + '7:45.00');
  await expect(page.getByRole('row').nth(13)).toHaveText('2.08 km' + '10:00');
});
