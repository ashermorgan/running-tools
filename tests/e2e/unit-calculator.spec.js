const { test, expect } = require('@playwright/test');

test('Basic usage', async ({ page }) => {
  // Go to unit calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Unit Calculator' }).click();
  await expect(page).toHaveTitle('Unit Calculator - Running Tools');

  // Convert distance units (5000m to mi)
  await page.getByLabel('Input units').selectOption('Meters');
  await page.getByLabel('Input value').fill('5000');
  await page.getByLabel('Output units').selectOption('Miles');
  await expect(page.getByLabel('Output value')).toHaveText('3.107');

  // Convert speed and pace units (0:04:32/km to mph)
  await page.getByLabel('Selected unit category').selectOption('Speed & Pace');
  await page.getByLabel('Input units').selectOption('Time per Kilometer');
  await page.getByLabel('Input time hours').fill('0');
  await page.getByLabel('Input time minutes').fill('4');
  await page.getByLabel('Input time seconds').fill('32');
  await page.getByLabel('Output units').selectOption('Miles per Hour');
  await expect(page.getByLabel('Output value')).toHaveText('8.224');

  // Convert speed and pace units (10 kph to time per mile)
  await page.getByLabel('Input units').selectOption('Kilometers per Hour');
  await page.getByLabel('Input value').fill('10');
  await page.getByLabel('Output units').selectOption('Time per Mile');
  await expect(page.getByLabel('Output value')).toHaveText('00:09:39.366');

  // Convert time units (83.76 min to hh:mm:ss)
  await page.getByLabel('Selected unit category').selectOption('Time');
  await page.getByLabel('Input units').selectOption('Minutes');
  await page.getByLabel('Input value').fill('83.76');
  await page.getByLabel('Output units').selectOption('hh:mm:ss');
  await expect(page.getByLabel('Output value')).toHaveText('01:23:45.600');

  // Convert time units (6:54:32.100 to seconds)
  await page.getByLabel('Selected unit category').selectOption('Time');
  await page.getByLabel('Input units').selectOption('hh:mm:ss');
  await page.getByLabel('Input time hours').fill('6');
  await page.getByLabel('Input time minutes').fill('54');
  await page.getByLabel('Input time seconds').fill('32.1');
  await page.getByLabel('Output units').selectOption('seconds');
  await expect(page.getByLabel('Output value')).toHaveText('24872.100');

  // Return to speed and pace category
  await page.getByLabel('Selected unit category').selectOption('Speed & Pace');
  await expect(page.getByLabel('Output value')).toHaveText('00:09:39.366');
});

test('Save state across page reloads', async ({ page }) => {
  // Go to unit calculator
  await page.goto('/');
  await page.getByRole('button', { name: 'Unit Calculator' }).click();

  // Convert distance units (5000m to mi)
  await page.getByLabel('Input units').selectOption('Meters');
  await page.getByLabel('Input value').fill('5000');
  await page.getByLabel('Output units').selectOption('Miles');
  await expect(page.getByLabel('Output value')).toHaveText('3.107');

  // Convert time units (6:54:32.100 to seconds)
  await page.getByLabel('Selected unit category').selectOption('Time');
  await page.getByLabel('Input units').selectOption('hh:mm:ss');
  await page.getByLabel('Input time hours').fill('6');
  await page.getByLabel('Input time minutes').fill('54');
  await page.getByLabel('Input time seconds').fill('32.1');
  await page.getByLabel('Output units').selectOption('seconds');
  await expect(page.getByLabel('Output value')).toHaveText('24872.100');

  // Convert speed and pace units (10 kph to time per mile)
  await page.getByLabel('Selected unit category').selectOption('Speed & Pace');
  await page.getByLabel('Input units').selectOption('Kilometers per Hour');
  await page.getByLabel('Input value').fill('10');
  await page.getByLabel('Output units').selectOption('Time per Mile');
  await expect(page.getByLabel('Output value')).toHaveText('00:09:39.366');

  // Reload page
  await page.reload();

  // Assert distance result is correct (state not reset)
  await expect(page.getByLabel('Output value')).toHaveText('3.107');

  // Assert time result is correct (state not reset)
  await page.getByLabel('Selected unit category').selectOption('Time');
  await expect(page.getByLabel('Output value')).toHaveText('24872.100');

  // Assert speed & pace result is correct (state not reset)
  await page.getByLabel('Selected unit category').selectOption('Speed & Pace');
  await expect(page.getByLabel('Output value')).toHaveText('00:09:39.366');
});
