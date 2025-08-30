import { test, expect } from '@playwright/test';

test('Workout Calculator', async ({ page }) => {
  // Go to workout calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Workout Calculator' }).click();
  await expect(page).toHaveTitle('Workout Calculator - Running Tools');

  // Test standard workout results
  {
    // Enter input race (2 mi in 10:30)
    await page.getByLabel('Input race distance value').fill('2');
    await page.getByLabel('Input race distance unit').selectOption('Miles');
    await page.getByLabel('Input race duration hours').fill('0');
    await page.getByLabel('Input race duration minutes').fill('10');
    await page.getByLabel('Input race duration seconds').fill('30');

    // Assert workout splits are correct
    await expect(page.getByRole('row').nth(1)).toHaveText('400 m @ 1 mi' + '1:13.45');
    await expect(page.getByRole('row').nth(3)).toHaveText('1600 m @ 1:00:00' + '5:45.44');
    await expect(page.getByRole('row')).toHaveCount(5);
  }

  // Test different calculator options options
  {
    // Change prediction model
    await page.getByText('Advanced Options').click();
    await page.getByLabel('Prediction model').selectOption('Riegel\'s Model');

    // Assert workout splits are correct
    await expect(page.getByRole('row').nth(1)).toHaveText('400 m @ 1 mi' + '1:15.10');
    await expect(page.getByRole('row').nth(3)).toHaveText('1600 m @ 1:00:00' + '5:45.64');
    await expect(page.getByRole('row')).toHaveCount(5);

    // Change Riegel exponent
    await page.getByLabel('Riegel Exponent').fill('1.12');

    // Assert workout splits are correct
    await expect(page.getByRole('row').nth(1)).toHaveText('400 m @ 1 mi' + '1:12.04');
    await expect(page.getByRole('row').nth(3)).toHaveText('1600 m @ 1:00:00' + '6:17.47');
    await expect(page.getByRole('row')).toHaveCount(5);
  }

  // Test modified default target set
  {
    // Edit default target set
    await page.getByRole('button', { name: 'Edit target set' }).click();
    await page.getByLabel('Target set label').fill('Less-common Workout Targets');
    await expect(page.getByLabel('Custom target name')).toHaveCount(0);
    await page.getByLabel('Split distance value').nth(0).fill('401');
    await page.getByLabel('Target distance value').nth(0).fill('2');
    await page.getByRole('button', { name: 'Add distance target' }).click();
    await page.getByLabel('Split distance value').last().fill('1');
    await page.getByLabel('Split distance unit').last().selectOption('Miles');
    await page.getByLabel('Target distance value').last().fill('10');
    await page.getByLabel('Target distance unit').last().selectOption('Kilometers');
    await page.getByRole('button', { name: 'Add time target' }).click();
    await page.getByLabel('Split distance value').last().fill('600');
    await page.getByLabel('Split distance unit').last().selectOption('Meters');
    await page.getByLabel('Target duration minutes').last().fill('19');
    await page.getByLabel('Target duration seconds').last().fill('0');
    await page.getByRole('button', { name: 'Add distance target' }).click();
    await page.getByLabel('Split distance value').last().fill('2');
    await page.getByLabel('Split distance unit').last().selectOption('Miles');
    await page.getByLabel('Target distance value').last().fill('2');
    await page.getByLabel('Target distance unit').last().selectOption('Miles');
    await page.getByRole('button', { name: 'Close' }).click();

    // Assert workout splits are correct
    await expect(page.getByRole('row').nth(1)).toHaveText('401 m @ 2 mi' + '1:18.49');
    await expect(page.getByRole('row').nth(2)).toHaveText('600 m @ 19:00' + '2:05.14');
    await expect(page.getByRole('row').nth(4)).toHaveText('1 mi @ 10 km' + '6:00.90');
    await expect(page.getByRole('row').nth(7)).toHaveText('2 mi' + '10:30.00');
    await expect(page.getByRole('row')).toHaveCount(8);
  }

  // Test custom target set (with custom target names)
  {
    // Enable target name customization
    await page.getByLabel('Workout name customization').selectOption('Enabled');

    // Create custom target set
    await page.getByLabel('Selected target set').selectOption('[ Create New Target Set ]');
    await expect(page.getByRole('row').nth(4)).toHaveText('There aren\'t any targets in this set yet.');
    await expect(page.getByRole('row')).toHaveCount(5);

    // Edit new target set
    await expect(page.getByRole('row').nth(1)).toHaveText('There aren\'t any targets in this set yet.');
    await expect(page.getByLabel('Target set label')).toHaveValue('New target set');
    await page.getByLabel('Target set label').fill('Workout Target Set #2');
    await page.getByRole('button', { name: 'Add distance target' }).click();
    await page.getByLabel('Custom target name').last().fill('800m Interval');
    await page.getByLabel('Split distance value').last().fill('800');
    await page.getByLabel('Split distance unit').last().selectOption('Meters');
    await page.getByLabel('Target distance value').last().fill('5');
    await page.getByLabel('Target distance unit').last().selectOption('Kilometers');
    await page.getByRole('button', { name: 'Add distance target' }).click();
    await page.getByLabel('Split distance value').last().fill('1600');
    await page.getByLabel('Split distance unit').last().selectOption('Meters');
    await page.getByLabel('Target distance value').last().fill('10');
    await page.getByLabel('Target distance unit').last().selectOption('Kilometers');
    await page.getByRole('button', { name: 'Close' }).click();

    // Assert workout splits are correct
    await expect(page.getByRole('row').nth(1)).toHaveText('800m Interval' + '2:45.08');
    await expect(page.getByRole('row').nth(2)).toHaveText('1600 m @ 10 km' + '5:58.81');
    await expect(page.getByRole('row')).toHaveCount(3);
  }

  // Reload page
  await page.reload();

  // Assert outputs are still the same
  {
    // Assert workout splits are correct (custom targets and model settings not reset)
    await expect(page.getByRole('row').nth(1)).toHaveText('800m Interval' + '2:45.08');
    await expect(page.getByRole('row').nth(2)).toHaveText('1600 m @ 10 km' + '5:58.81');
    await expect(page.getByRole('row')).toHaveCount(3);

    // Switch target set
    await page.getByText('Advanced Options').click();
    await page.getByLabel('Selected target set').selectOption('Less-common Workout Targets');

    // Assert workout splits are correct
    await expect(page.getByRole('row').nth(1)).toHaveText('401 m @ 2 mi' + '1:18.49');
    await expect(page.getByRole('row').nth(2)).toHaveText('600 m @ 19:00' + '2:05.14');
    await expect(page.getByRole('row').nth(4)).toHaveText('1 mi @ 10 km' + '6:00.90');
    await expect(page.getByRole('row').nth(7)).toHaveText('2 mi' + '10:30.00');
    await expect(page.getByRole('row')).toHaveCount(8);
  }

  // Test target set deletion and reversion
  {
    // Delete custom target set
    await page.getByLabel('Selected target set').selectOption('Workout Target Set #2');
    await page.getByRole('button', { name: 'Edit target set' }).click();
    await expect(page.getByLabel('Target set label')).toHaveValue('Workout Target Set #2');
    await page.getByRole('button', { name: 'Delete target set' }).click();

    // Switch to default target set
    await page.getByLabel('Selected target set').selectOption('Less-common Workout Targets');

    // Assert workout splits are correct (back to default target set)
    await expect(page.getByRole('row').nth(1)).toHaveText('401 m @ 2 mi' + '1:18.49');
    await expect(page.getByRole('row').nth(2)).toHaveText('600 m @ 19:00' + '2:05.14');
    await expect(page.getByRole('row').nth(4)).toHaveText('1 mi @ 10 km' + '6:00.90');
    await expect(page.getByRole('row').nth(7)).toHaveText('2 mi' + '10:30.00');
    await expect(page.getByRole('row')).toHaveCount(8);

    // Revert target set
    await page.getByRole('button', { name: 'Edit target set' }).click();
    await expect(page.getByLabel('Target set label')).toHaveValue('Less-common Workout Targets');
    await page.getByRole('button', { name: 'Revert target set' }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    // Assert paces are correct
    await expect(page.getByRole('row').nth(1)).toHaveText('400 m @ 1 mi' + '1:12.04');
    await expect(page.getByRole('row').nth(3)).toHaveText('1600 m @ 1:00:00' + '6:17.47');
    await expect(page.getByRole('row')).toHaveCount(5);

    // Assert title was reset
    await page.getByRole('button', { name: 'Edit target set' }).click();
    await expect(page.getByLabel('Target set label')).toHaveValue('Common Workout Targets');
  }
});
