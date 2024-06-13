import { test, expect } from '@playwright/test';

test('Basic usage', async ({ page }) => {
  // Go to split calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Split Calculator' }).click();
  await expect(page).toHaveTitle('Split Calculator - Running Tools');

  // Enter input 5K splits (7:00, 6:30, 6:30)
  await page.getByLabel('Split duration minutes').nth(0).fill('7');
  await page.getByLabel('Split duration seconds').nth(0).fill('0');
  await page.getByLabel('Split duration minutes').nth(1).fill('6');
  await page.getByLabel('Split duration seconds').nth(1).fill('30');
  await page.getByLabel('Split duration minutes').nth(2).fill('6');
  await page.getByLabel('Split duration seconds').nth(2).fill('30');

  // Assert times and paces are correct
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(1)).toHaveText('7:00.00');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('7:00 / mi');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(1)).toHaveText('13:30.00');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('6:30 / mi');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(1)).toHaveText('20:00.00');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(3)).toHaveText('5:52 / mi');
  await expect(page.getByRole('row')).toHaveCount(4);

  // Change default units
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Assert paces are correct
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('4:21 / km');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('4:02 / km');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(3)).toHaveText('3:39 / km');
});

test('Customize target sets', async ({ page }) => {
  // Go to split calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Split Calculator' }).click();

  // Enter input 5K splits (7:00, 6:30, 6:30)
  await page.getByLabel('Split duration minutes').nth(0).fill('7');
  await page.getByLabel('Split duration seconds').nth(0).fill('0');
  await page.getByLabel('Split duration minutes').nth(1).fill('6');
  await page.getByLabel('Split duration seconds').nth(1).fill('30');
  await page.getByLabel('Split duration minutes').nth(2).fill('6');
  await page.getByLabel('Split duration seconds').nth(2).fill('30');

  // Edit target set
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await page.getByLabel('Target set label').fill('5K 1600m Splits');
  await page.getByLabel('Target distance value').nth(0).fill('1.6');
  await page.getByLabel('Target distance unit').nth(0).selectOption('Kilometers');
  await page.getByLabel('Target distance value').nth(1).fill('3.2');
  await page.getByLabel('Target distance unit').nth(1).selectOption('Kilometers');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(3).fill('4.8');
  await page.getByLabel('Target distance unit').nth(3).selectOption('Kilometers');
  await page.getByRole('button', { name: 'Close' }).click();

  // Assert times and paces are correct (new distances are processed)
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(1)).toHaveText('7:00.00');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('7:02 / mi');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(1)).toHaveText('13:30.00');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('6:32 / mi');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(1)).toHaveText('13:30.00');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(3)).toHaveText('0:00 / mi');
  await expect(page.getByRole('row').nth(4).getByRole('cell').nth(1)).toHaveText('20:00.00');
  await expect(page.getByRole('row').nth(4).getByRole('cell').nth(3)).toHaveText('52:18 / mi');
  await expect(page.getByRole('row')).toHaveCount(5);

  // Update third and fourth splits
  await page.getByLabel('Split duration minutes').nth(2).fill('6');
  await page.getByLabel('Split duration seconds').nth(2).fill('0');
  await page.getByLabel('Split duration minutes').nth(3).fill('0');
  await page.getByLabel('Split duration seconds').nth(3).fill('30');
  await page.getByLabel('Split duration seconds').nth(3).blur();

  // Assert times and paces are correct (new input splits are processed)
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(1)).toHaveText('7:00.00');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('7:02 / mi');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(1)).toHaveText('13:30.00');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('6:32 / mi');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(1)).toHaveText('19:30.00');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(3)).toHaveText('6:02 / mi');
  await expect(page.getByRole('row').nth(4).getByRole('cell').nth(1)).toHaveText('20:00.00');
  await expect(page.getByRole('row').nth(4).getByRole('cell').nth(3)).toHaveText('4:01 / mi');
  await expect(page.getByRole('row')).toHaveCount(5);

  // Create custom target set
  await page.getByLabel('Selected target set').selectOption('[ Create New Target Set ]');
  await expect(page.getByRole('row').nth(1)).toHaveText('There aren\'t any targets in this set yet.');
  await expect(page.getByRole('row')).toHaveCount(2);

  // Edit custom target set
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('New target set');
  await page.getByLabel('Target set label').fill('800m Splits');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(0).fill('0.4');
  await page.getByLabel('Target distance unit').nth(0).selectOption('Kilometers');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(1).fill('800');
  await page.getByLabel('Target distance unit').nth(1).selectOption('Meters');
  await page.getByRole('button', { name: 'Close' }).click();

  // Assert times and paces are correct (input splits initialized to zero)
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(1)).toHaveText('0:00.00');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('0:00 / mi');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(1)).toHaveText('0:00.00');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('0:00 / mi');
  await expect(page.getByRole('row')).toHaveCount(3);

  // Switch target set
  await page.getByLabel('Selected target set').selectOption('5K 1600m Splits');

  // Assert times and paces are correct (input splits are not reset)
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(1)).toHaveText('7:00.00');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('7:02 / mi');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(1)).toHaveText('13:30.00');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('6:32 / mi');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(1)).toHaveText('19:30.00');
  await expect(page.getByRole('row').nth(3).getByRole('cell').nth(3)).toHaveText('6:02 / mi');
  await expect(page.getByRole('row').nth(4).getByRole('cell').nth(1)).toHaveText('20:00.00');
  await expect(page.getByRole('row').nth(4).getByRole('cell').nth(3)).toHaveText('4:01 / mi');
  await expect(page.getByRole('row')).toHaveCount(5);
});

test('Save settings and state across page reloads', async ({ page }) => {
  // Go to split calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Split Calculator' }).click();

  // Create custom target set
  await page.getByLabel('Selected target set').selectOption('[ Create New Target Set ]');

  // Edit new target set
  await page.getByRole('button', { name: 'Edit target set' }).click();
  await expect(page.getByLabel('Target set label')).toHaveValue('New target set');
  await page.getByLabel('Target set label').fill('800m Splits');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(0).fill('0.4');
  await page.getByLabel('Target distance unit').nth(0).selectOption('Kilometers');
  await page.getByRole('button', { name: 'Add distance target' }).click();
  await page.getByLabel('Target distance value').nth(1).fill('800');
  await page.getByLabel('Target distance unit').nth(1).selectOption('Meters');
  await page.getByRole('button', { name: 'Close' }).click();

  // Enter 800m (0:55, 1:05)
  await page.getByLabel('Split duration minutes').nth(0).fill('0');
  await page.getByLabel('Split duration seconds').nth(0).fill('55');
  await page.getByLabel('Split duration minutes').nth(1).fill('1');
  await page.getByLabel('Split duration seconds').nth(1).fill('5');

  // Change default units
  await page.getByLabel('Default units').selectOption('Kilometers');

  // Reload page
  await page.reload();

  // Assert paces are correct (custom targets, split times, and default units not reset)
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(1)).toHaveText('0:55.00');
  await expect(page.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('2:18 / km');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(1)).toHaveText('2:00.00');
  await expect(page.getByRole('row').nth(2).getByRole('cell').nth(3)).toHaveText('2:43 / km');
  await expect(page.getByRole('row')).toHaveCount(3);
});
