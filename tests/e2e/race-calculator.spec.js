const { test, expect } = require('@playwright/test');

test('Basic Race Calculator usage', async ({ page }) => {
  await page.goto('/');

  // Go to race calculator
  await page.getByRole('button', { name: 'Race Calculator' }).click();
  await expect(page).toHaveTitle('Race Calculator - Running Tools');

  // Enter input race (2 mi in 10:30)
  await page.getByLabel('Input distance value').fill('2');
  await page.getByLabel('Input distance unit').selectOption('Miles');
  await page.getByLabel('Input race duration hours').fill('0');
  await page.getByLabel('Input race duration minutes').fill('10');
  await page.getByLabel('Input race duration seconds').fill('30');

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '4:55.53' + '4:56 / mi');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '16:47.58' + '5:24 / mi');

  // Assert race statistics are correct
  await page.getByText('Race Statistics').click();
  await expect(page.getByText('Purdy Points:')).toContainText(': 680.1');
  await expect(page.getByText('V̇O₂:')).toContainText(': 61.0 ml/kg/min (100.5% of max)');
  await expect(page.getByText('V̇O₂ Max:')).toContainText(': 60.7 ml/kg/min');

  // Change default units
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '4:55.53' + '3:04 / km');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '16:47.58' + '3:22 / km');

  // Change prediction model
  await page.getByLabel('Prediction model').selectOption('Riegel\'s Model');

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '5:02.17' + '3:08 / km');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '16:44.86' + '3:21 / km');

  // Change Riegel exponent
  await page.getByLabel('Riegel Exponent').fill('1.12');

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '4:49.86' + '3:00 / km');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '17:11.77' + '3:26 / km');
});
