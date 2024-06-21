import { test, expect } from '@playwright/test';

test('Basic usage', async ({ page }) => {
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
  await expect(page.getByRole('row')).toHaveCount(31);

  // Change default units
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Assert paces are correct
  await expect(page.getByRole('row').nth(11)).toHaveText('1 mi' + '7:45.00');
  await expect(page.getByRole('row').nth(13)).toHaveText('2.08 km' + '10:00');
  await expect(page.getByRole('row')).toHaveCount(31);
});

test('Customize target sets', async ({ page }) => {
  // Go to pace calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Pace Calculator' }).click();

  // Enter input pace (2 mi in 15:30)
  await page.getByLabel('Input distance value').fill('2');
  await page.getByLabel('Input distance unit').selectOption('Miles');
  await page.getByLabel('Input duration hours').fill('0');
  await page.getByLabel('Input duration minutes').fill('15');
  await page.getByLabel('Input duration seconds').fill('30');

  // Edit default target set
  await page.getByText('Advanced Options').click();
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await page.getByLabel('Target set label').fill('Less-common Pace Targets');
  await page.getByLabel('Target distance value').nth(10).fill('1.01');
  await page.getByLabel('Target distance unit').nth(10).selectOption('Miles');
  await page.getByLabel('Target duration second').nth(0).fill('1');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').last().fill('1.5');
  await page.getByLabel('Target distance unit').last().selectOption('Miles');
  await page.getByRole('button', { name: 'Add time target' }).click();
  await page.getByLabel('Target duration minutes').last().fill('19');
  await page.getByLabel('Target duration seconds').last().fill('0');
  await page.getByRole('button', { name: 'Close' }).click();

  // Assert paces are correct
  await expect(page.getByRole('row').nth(11)).toHaveText('1.01 mi' + '7:49.65');
  await expect(page.getByRole('row').nth(13)).toHaveText('1.29 mi' + '10:01');
  await expect(page.getByRole('row').nth(14)).toHaveText('1.5 mi' + '11:37.50');
  await expect(page.getByRole('row').nth(18)).toHaveText('2.45 mi' + '19:00');
  await expect(page.getByRole('row')).toHaveCount(33);

  // Create custom target set
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
  await page.getByRole('button', { name: 'Close' }).click();

  // Assert paces are correct
  await expect(page.getByRole('row').nth(1)).toHaveText('0.4 km' + '1:55.57');
  await expect(page.getByRole('row').nth(2)).toHaveText('800 m' + '3:51.15');
  await expect(page.getByRole('row')).toHaveCount(3);

  // Switch target set
  await page.getByLabel('Selected target set').selectOption('Less-common Pace Targets');

  // Assert paces are correct
  await expect(page.getByRole('row').nth(11)).toHaveText('1.01 mi' + '7:49.65');
  await expect(page.getByRole('row').nth(13)).toHaveText('1.29 mi' + '10:01');
  await expect(page.getByRole('row').nth(14)).toHaveText('1.5 mi' + '11:37.50');
  await expect(page.getByRole('row').nth(18)).toHaveText('2.45 mi' + '19:00');
  await expect(page.getByRole('row')).toHaveCount(33);

  // Delete custom target set
  await page.getByLabel('Selected target set').selectOption('800m Splits');
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('800m Splits');
  await page.getByRole('button', { name: 'Delete target set' }).click();

  // Assert paces are correct (back to default target set)
  await expect(page.getByRole('row').nth(11)).toHaveText('1.01 mi' + '7:49.65');
  await expect(page.getByRole('row').nth(13)).toHaveText('1.29 mi' + '10:01');
  await expect(page.getByRole('row').nth(14)).toHaveText('1.5 mi' + '11:37.50');
  await expect(page.getByRole('row').nth(18)).toHaveText('2.45 mi' + '19:00');
  await expect(page.getByRole('row')).toHaveCount(33);

  // Revert target set
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('Less-common Pace Targets');
  await page.getByRole('button', { name: 'Revert target set' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // Assert paces are correct
  await expect(page.getByRole('row').nth(11)).toHaveText('1 mi' + '7:45.00');
  await expect(page.getByRole('row').nth(13)).toHaveText('1.29 mi' + '10:00');
  await expect(page.getByRole('row')).toHaveCount(31);

  // Assert title was reset
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('Common Pace Targets');
});

test('Save settings across page reloads', async ({ page }) => {
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

  // Edit new target set
  await expect(page.getByLabel('Target set label')).toHaveValue('New target set');
  await page.getByLabel('Target set label').fill('Less-common Pace Targets');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').last().fill('1.01');
  await page.getByLabel('Target distance unit').last().selectOption('Miles');
  await page.getByRole('button', { name: 'Add time target' }).click();
  await page.getByLabel('Target duration minutes').last().fill('19');
  await page.getByLabel('Target duration seconds').last().fill('0');
  await page.getByRole('button', { name: 'Close' }).click();

  // Change default units
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Reload page
  await page.reload();

  // Assert paces are correct (custom targets and default units not reset)
  await expect(page.getByRole('row').nth(1)).toHaveText('1.01 mi' + '7:49.65');
  await expect(page.getByRole('row').nth(2)).toHaveText('3.95 km' + '19:00');
  await expect(page.getByRole('row')).toHaveCount(3);
});
