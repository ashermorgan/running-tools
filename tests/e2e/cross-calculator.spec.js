import { test, expect } from '@playwright/test';

test('Cross-calculator', async ({ page }) => {
  // Go to batch calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Batch Calculator' }).click();

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

  // Change calculator
  await page.getByLabel('Calculator').selectOption('Race Calculator');

  // Change prediction model
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Prediction model').selectOption('Riegel\'s Model');

  // Go to pace calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Pace Calculator' }).click();

  // Enter input pace (2 mi in 15:30)
  await page.getByLabel('Input distance value').fill('2');
  await page.getByLabel('Input distance unit').selectOption('Miles');
  await page.getByLabel('Input duration hours').fill('0');
  await page.getByLabel('Input duration minutes').fill('15');
  await page.getByLabel('Input duration seconds').fill('30');

  // Create custom target set
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Selected target set').selectOption('[ Create New Target Set ]');
  await expect(page.getByRole('row').nth(4)).toHaveText('There aren\'t any targets in this set yet.');
  await expect(page.getByRole('row')).toHaveCount(5);

  // Edit new target set
  await expect(page.getByRole('row').nth(1)).toHaveText('There aren\'t any targets in this set yet.');
  await expect(page.getByLabel('Target set label')).toHaveValue('New target set');
  await page.getByLabel('Target set label').fill('800m Splits');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(0).fill('0.4');
  await page.getByLabel('Target distance unit').nth(0).selectOption('Kilometers');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(1).fill('800');
  await page.getByLabel('Target distance unit').nth(1).selectOption('Meters');
  await page.getByRole('button', { name: 'Add time target' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // Go to race calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Race Calculator' }).click();

  // Enter input race (2 mi in 10:30)
  await page.getByLabel('Input race distance value').fill('2');
  await page.getByLabel('Input race distance unit').selectOption('Miles');
  await page.getByLabel('Input race duration hours').fill('0');
  await page.getByLabel('Input race duration minutes').fill('10');
  await page.getByLabel('Input race duration seconds').fill('30');

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

  // Go to workout calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Workout Calculator' }).click();

  // Enter input race (1 mi in 5:01)
  await page.getByLabel('Input race distance value').fill('1');
  await page.getByLabel('Input race distance unit').selectOption('Miles');
  await page.getByLabel('Input race duration hours').fill('0');
  await page.getByLabel('Input race duration minutes').fill('5');
  await page.getByLabel('Input race duration seconds').fill('1');

  // Change prediction model
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Prediction model').selectOption('V̇O₂ Max Model');

  // Change default units (should update on other calculators too)
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Return to batch calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Batch Calculator' }).click();

  // Assert pace results are correct (inputs and options not reset)
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:24');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('2:56');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(17);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Assert pace results are correct (inputs and options not reset, new pace targets loaded)
  await page.getByLabel('Calculator').selectOption('Pace Calculator');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(4);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:37');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(4);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('3:11');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(4);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Assert workout results are correct (new workout options loaded)
  await page.getByLabel('Calculator').selectOption('Workout Calculator');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(0)).toHaveText('2 mi');
  await expect(page.getByRole('row').nth(0).getByRole('cell').nth(2)).toHaveText('800 m @ 5 km');
  await expect(page.getByRole('row').nth(0).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText('10:30');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(2)).toHaveText('2:42');
  await expect(page.getByRole('row').nth(1).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(0)).toHaveText('12:50');
  await expect(page.getByRole('row').nth(15).getByRole('cell').nth(2)).toHaveText('3:17');
  await expect(page.getByRole('row').nth(15).getByRole('cell')).toHaveCount(5);
  await expect(page.getByRole('row')).toHaveCount(16);

  // Return to pace calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Pace Calculator' }).click();

  // Assert paces are correct (input pace not reset)
  await expect(page.getByRole('row').nth(1)).toHaveText('0.4 km' + '1:55.57');
  await expect(page.getByRole('row').nth(2)).toHaveText('800 m' + '3:51.15');
  await expect(page.getByRole('row').nth(3)).toHaveText('2.08 km' + '10:00');
  await expect(page.getByRole('row')).toHaveCount(4);

  // Return to race calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Race Calculator' }).click();

  // Assert race predictions are correct (input race not resset and new prediction model loaded)
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

  // Return to workout calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Workout Calculator' }).click();

  // Assert workout splits are correct (input race and prediction model not reset)
  await expect(page.getByRole('row').nth(1)).toHaveText('400 m @ 1 mi' + '1:14.81');
  await expect(page.getByRole('row').nth(3)).toHaveText('1600 m @ 1:00:00' + '5:53.56');
  await expect(page.getByRole('row')).toHaveCount(5);
});
