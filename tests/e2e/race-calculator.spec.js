import { test, expect } from '@playwright/test';

test('Basic usage', async ({ page }) => {
  // Go to race calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Race Calculator' }).click();
  await expect(page).toHaveTitle('Race Calculator - Running Tools');

  // Enter input race (2 mi in 10:30)
  await page.getByLabel('Input race distance value').fill('2');
  await page.getByLabel('Input race distance unit').selectOption('Miles');
  await page.getByLabel('Input race duration hours').fill('0');
  await page.getByLabel('Input race duration minutes').fill('10');
  await page.getByLabel('Input race duration seconds').fill('30');

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '4:55.53' + '4:56 / mi');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '16:47.58' + '5:24 / mi');
  await expect(page.getByRole('row')).toHaveCount(17);

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
  await expect(page.getByRole('row')).toHaveCount(17);

  // Change prediction model
  await page.getByLabel('Prediction model').selectOption('Riegel\'s Model');

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '5:02.17' + '3:08 / km');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '16:44.86' + '3:21 / km');
  await expect(page.getByRole('row')).toHaveCount(17);

  // Change Riegel exponent
  await page.getByLabel('Riegel Exponent').fill('1.12');

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '4:49.86' + '3:00 / km');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '17:11.77' + '3:26 / km');
  await expect(page.getByRole('row')).toHaveCount(17);
});

test('Customize target sets', async ({ page }) => {
  // Go to race calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Race Calculator' }).click();

  // Enter input race (2 mi in 10:30)
  await page.getByLabel('Input race distance value').fill('2');
  await page.getByLabel('Input race distance unit').selectOption('Miles');
  await page.getByLabel('Input race duration hours').fill('0');
  await page.getByLabel('Input race duration minutes').fill('10');
  await page.getByLabel('Input race duration seconds').fill('30');

  // Edit default target set
  await page.getByText('Advanced Options').click();
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await page.getByLabel('Target set label').fill('Less-common Race Targets');
  await page.getByLabel('Target distance value').nth(4).fill('1.01');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').last().fill('1.5');
  await page.getByLabel('Target distance unit').last().selectOption('Miles');
  await page.getByRole('button', { name: 'Add time target' }).click();
  await page.getByLabel('Target duration minutes').last().fill('19');
  await page.getByLabel('Target duration seconds').last().fill('0');
  await page.getByRole('button', { name: 'Close' }).click();

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1.01 mi' + '4:58.81' + '4:56 / mi');
  await expect(page.getByRole('row').nth(6)).toHaveText('1.5 mi' + '7:41.60' + '5:08 / mi');
  await expect(page.getByRole('row').nth(12)).toHaveText('3.49 mi' + '19:00' + '5:27 / mi');
  await expect(page.getByRole('row')).toHaveCount(19);

  // Create custom target set
  await page.getByLabel('Selected target set').selectOption('[ Create New Target Set ]');
  await expect(page.getByRole('row').nth(1)).toHaveText('There aren\'t any targets in this set yet.');
  await expect(page.getByRole('row')).toHaveCount(2);

  // Edit new target set
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('New target set');
  await page.getByLabel('Target set label').fill('XC Race Targets');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(0).fill('5');
  await page.getByLabel('Target distance unit').nth(0).selectOption('Kilometers');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(1).fill('10');
  await page.getByLabel('Target distance unit').nth(1).selectOption('Kilometers');
  await page.getByRole('button', { name: 'Close' }).click();

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(1)).toHaveText('5 km' + '16:47.58' + '5:24 / mi');
  await expect(page.getByRole('row').nth(2)).toHaveText('10 km' + '34:53.84' + '5:37 / mi');
  await expect(page.getByRole('row')).toHaveCount(3);

  // Switch target set
  await page.getByLabel('Selected target set').selectOption('Less-common Race Targets');

  // Assert race predictions are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1.01 mi' + '4:58.81' + '4:56 / mi');
  await expect(page.getByRole('row').nth(6)).toHaveText('1.5 mi' + '7:41.60' + '5:08 / mi');
  await expect(page.getByRole('row').nth(12)).toHaveText('3.49 mi' + '19:00' + '5:27 / mi');
  await expect(page.getByRole('row')).toHaveCount(19);

  // Delete custom target set
  await page.getByLabel('Selected target set').selectOption('XC Race Targets');
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('XC Race Targets');
  await page.getByRole('button', { name: 'Delete target set' }).click();

  // Switch to default target set
  await page.getByLabel('Selected target set').selectOption('Less-common Race Targets');

  // Assert race predictions are correct (back to default target set)
  await expect(page.getByRole('row').nth(5)).toHaveText('1.01 mi' + '4:58.81' + '4:56 / mi');
  await expect(page.getByRole('row').nth(6)).toHaveText('1.5 mi' + '7:41.60' + '5:08 / mi');
  await expect(page.getByRole('row').nth(12)).toHaveText('3.49 mi' + '19:00' + '5:27 / mi');
  await expect(page.getByRole('row')).toHaveCount(19);

  // Revert target set
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('Less-common Race Targets');
  await page.getByRole('button', { name: 'Revert target set' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // Assert paces are correct
  await expect(page.getByRole('row').nth(5)).toHaveText('1 mi' + '4:55.53' + '4:56 / mi');
  await expect(page.getByRole('row').nth(10)).toHaveText('5 km' + '16:47.58' + '5:24 / mi');
  await expect(page.getByRole('row')).toHaveCount(17);

  // Assert title was reset
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('Common Race Targets');
});

test('Save settings across page reloads', async ({ page }) => {
  // Go to race calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Race Calculator' }).click();

  // Enter input race (2 mi in 10:30)
  await page.getByLabel('Input race distance value').fill('2');
  await page.getByLabel('Input race distance unit').selectOption('Miles');
  await page.getByLabel('Input race duration hours').fill('0');
  await page.getByLabel('Input race duration minutes').fill('10');
  await page.getByLabel('Input race duration seconds').fill('30');

  // Create custom target set
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Selected target set').selectOption('[ Create New Target Set ]');

  // Edit new target set
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('New target set');
  await page.getByLabel('Target set label').fill('Less-common Race Targets');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').last().fill('1.01');
  await page.getByLabel('Target distance unit').last().selectOption('Miles');
  await page.getByRole('button', { name: 'Add time target' }).click();
  await page.getByLabel('Target duration minutes').last().fill('19');
  await page.getByLabel('Target duration seconds').last().fill('0');
  await page.getByRole('button', { name: 'Close' }).click();

  // Change default units
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Change prediction model
  await page.getByLabel('Prediction model').selectOption('Riegel\'s Model');

  // Change Riegel exponent
  await page.getByLabel('Riegel Exponent').fill('1.12');

  // Reload page
  await page.reload();

  // Assert race predictions are correct (custom targets, default units, and model settings not reset)
  await expect(page.getByRole('row').nth(1)).toHaveText('1.01 mi' + '4:53.11' + '3:00 / km');
  await expect(page.getByRole('row').nth(2)).toHaveText('5.47 km' + '19:00' + '3:29 / km');
  await expect(page.getByRole('row')).toHaveCount(3);
});
