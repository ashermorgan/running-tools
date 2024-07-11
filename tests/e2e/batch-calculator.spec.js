import { test, expect } from '@playwright/test';

test('Batch calculator', async ({ page }) => {
  // Structure:
  // - Test workout batch results, including modified prediction model
  // - Test pace batch results, including modified default units
  // - Test race batch results, including modified Riegel exponent
  // - Reload page
  // - Assert race batch results are still the same
  // - Assert pace batch results are still the same
  // - Assert workout batch results are still the same

  await page.goto('/');

  // Go to batch calculator
  await page.getByRole('button', { name: 'Batch Calculator' }).click();
  await expect(page).toHaveTitle('Batch Calculator - Running Tools');

  // Enter input pace (2 mi in 10:30)
  await page.getByLabel('Input distance value').fill('2');
  await page.getByLabel('Input distance unit').selectOption('Miles');
  await page.getByLabel('Input duration hours').fill('0');
  await page.getByLabel('Input duration minutes').fill('10');
  await page.getByLabel('Input duration seconds').fill('30');

  // Enter batch options (15 x 10s increments)
  await page.getByLabel('Duration increment minutes').fill('0');
  await page.getByLabel('Duration increment seconds').fill('10');
  await page.getByLabel('Number of rows').fill('15');

  // Assert workout results are correct
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m @ 5 km');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:41.21');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('3:16.91');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Change prediction model
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Prediction model').selectOption('Riegel\'s Model');

  // Assert workout results are correct
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m @ 5 km');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:40.78');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('3:16.51');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Change calculator
  await expect(page.getByLabel('Calculator')).toHaveValue('workout');
  await page.getByLabel('Calculator').selectOption('Pace Calculator');

  // Assert pace results are correct
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(6)).toHaveText('800 m');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(28)).toHaveText('10:00');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(6)).toHaveText('2:36.58');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(28)).toHaveText('1.90 mi');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(6)).toHaveText('3:11.38');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(28)).toHaveText('1.56 mi');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Assert prediction options are hidden
  await expect(page.getByLabel('Prediction model')).toHaveCount(0);

  // Change default units
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Assert pace results are correct
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(6)).toHaveText('800 m');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(28)).toHaveText('10:00');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(6)).toHaveText('2:36.58');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(28)).toHaveText('3.07 km');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(6)).toHaveText('3:11.38');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(28)).toHaveText('2.51 km');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Change calculator
  await page.getByLabel('Calculator').selectOption('Race Calculator');

  // Assert race results are correct
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:14.60');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('2:43.61');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Change Riegel exponent
  await expect(page.getByLabel('Prediction model')).toHaveValue('AverageModel');
  await page.getByLabel('Riegel Exponent').fill('1.12');

  // Assert race results are correct
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:11.72');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('2:40.09');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Reload page
  await page.reload();

  // Assert race results are correct (inputs and options not reset)
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:11.72');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('2:40.09');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Assert pace results are correct (inputs and options not reset)
  await page.getByLabel('Calculator').selectOption('Pace Calculator');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(6)).toHaveText('800 m');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(28)).toHaveText('10:00');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(6)).toHaveText('2:36.58');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(28)).toHaveText('3.07 km');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(6)).toHaveText('3:11.38');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(28)).toHaveText('2.51 km');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(31);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Assert workout results are correct (inputs and options not reset)
  await page.getByLabel('Calculator').selectOption('Workout Calculator');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m @ 5 km');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:40.78');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('3:16.51');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row')).toHaveCount(16);
});
