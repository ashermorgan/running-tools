const { test, expect } = require('@playwright/test');

test('Save and update state when navigating between calculators', async ({ page }) => {
  // Go to pace calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Pace Calculator' }).click();

  // Enter input pace (2 mi in 15:30)
  await page.getByLabel('Input distance value').fill('2');
  await page.getByLabel('Input distance unit').selectOption('Miles');
  await page.getByLabel('Input duration hours').fill('0');
  await page.getByLabel('Input duration minutes').fill('15');
  await page.getByLabel('Input duration seconds').fill('30');

  // Change default units (should update on other calculators too)
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Switch target set
  await page.getByLabel('Selected target set').selectOption('5K Mile Splits');

  // Go to race calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Race Calculator' }).click();

  // Enter input race (2 mi in 10:30)
  await page.getByLabel('Input race distance value').fill('2');
  await page.getByLabel('Input race distance unit').selectOption('Miles');
  await page.getByLabel('Input race duration hours').fill('0');
  await page.getByLabel('Input race duration minutes').fill('10');
  await page.getByLabel('Input race duration seconds').fill('30');

  // Change prediction model
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Prediction model').selectOption('Riegel\'s Model');

  // Go to split calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Split Calculator' }).click();

  // Edit target set
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await page.getByLabel('Target set label').fill('5K 1600m Splits');
  await page.getByLabel('Target distance value').nth(0).fill('1.6');
  await page.getByLabel('Target distance unit').nth(0).selectOption('Kilometers');
  await page.getByLabel('Target distance value').nth(1).fill('3.2');
  await page.getByLabel('Target distance unit').nth(1).selectOption('Kilometers');
  await page.getByRole('button', { name: 'Add time target' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // Enter input 5K splits (7:00, 6:30, 6:30)
  await page.getByLabel('Split duration minutes').nth(0).fill('7');
  await page.getByLabel('Split duration seconds').nth(0).fill('0');
  await page.getByLabel('Split duration minutes').nth(1).fill('6');
  await page.getByLabel('Split duration seconds').nth(1).fill('30');
  await page.getByLabel('Split duration minutes').nth(2).fill('6');
  await page.getByLabel('Split duration seconds').nth(2).fill('30');

  // Go to unit calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Unit Calculator' }).click();

  // Convert speed and pace units (10 kph to time per mile)
  await page.getByLabel('Selected unit category').selectOption('Speed & Pace');
  await page.getByLabel('Input units').selectOption('Kilometers per Hour');
  await page.getByLabel('Input value').fill('10');
  await page.getByLabel('Output units').selectOption('Time per Mile');

  // Return to pace calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Pace Calculator' }).click();

  // Assert paces are correct (input pace not reset)
  await expect(page.getByRole('row').nth(1)).toHaveText('1.6 km' + '7:42.30');
  await expect(page.getByRole('row').nth(2)).toHaveText('2.08 km' + '10:00');
  await expect(page.getByRole('row').nth(3)).toHaveText('3.2 km' + '15:24.60');
  await expect(page.getByRole('row').nth(4)).toHaveText('5 km' + '24:04.68');
  await expect(page.getByRole('row')).toHaveCount(5);

  // Return to race calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Race Calculator' }).click();

  // Assert race predictions are correct (input race and prediction model not reset)
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '5:02.17' + '3:08 / km');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '16:44.86' + '3:21 / km');
  await expect(page.getByRole('row')).toHaveCount(17);

  // Return to split calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Split Calculator' }).click();

  // Assert times and paces are correct (split times not reset)
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(1)).toHaveText('7:00.00');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('4:23 / km');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(1)).toHaveText('13:30.00');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('4:04 / km');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(1)).toHaveText('20:00.00');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(3)).toHaveText('3:37 / km');
  await expect(page.getByRole('row')).toHaveCount(4);

  // Return to unit calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Unit Calculator' }).click();

  // Assert result is correct (state not reset)
  await expect(page.getByLabel('Output value')).toHaveText('00:09:39.366');
});
