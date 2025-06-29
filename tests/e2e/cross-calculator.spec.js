import { test, expect } from '@playwright/test';

test('Cross-calculator', async ({ page }) => {
  // Structure:
  // - Set various options in the different calculators
  // - Go back and assert the options are not reset
  // - Assert localStorage entries are correct
  // - Reload app and assert the options are loaded

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

  // Change prediction model and enable target name customization
  await page.getByText('Advanced Options').click();
  await page.getByLabel('Prediction model').selectOption('V̇O₂ Max Model');
  await page.getByLabel('Target name customization').selectOption('Enabled');

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
  await expect(page.getByLabel('Target name customization')).toHaveValue("true");
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

  // Reset selected calculator
  await page.getByLabel('Calculator').selectOption('Race Calculator');

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

  // Assert general localStorage entries are correct
  await expect(await page.evaluate(() => localStorage.length)).toEqual(17);
  await expect(await page.evaluate(() => localStorage.getItem('running-tools.default-unit-system')))
    .toEqual(JSON.stringify('metric'));

  // Assert localStorage entries for the batch calculator are correct
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.batch-calculator-input'))).toEqual(JSON.stringify({
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 630,
    }));
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.batch-calculator-options'))).toEqual(JSON.stringify({
      calculator: 'race',
      increment: 10,
      rows: 15,
    }));

  // Assert localStorage entries for the pace calculator are correct
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.pace-calculator-input'))).toEqual(JSON.stringify({
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 930,
    }));
  const paceCalculatorKey = parseInt(JSON.parse(await page.evaluate(() =>
    localStorage.getItem('running-tools.pace-calculator-target-set'))));
  await expect(paceCalculatorKey - parseInt(Date.now().toString())).toBeLessThan(100000);
  await expect(await page.evaluate(() => localStorage.getItem('running-tools.pace-calculator-target-sets')))
    .toEqual(JSON.stringify({
    _pace_targets: {
      name: 'Common Pace Targets',
      targets: [
        { type: 'distance', distanceValue: 100, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 200, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 300, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 600, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1000, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1200, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1500, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 3200, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 4, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 6, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 8, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 6, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 8, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 0.5, distanceUnit: 'marathons' },
        { type: 'distance', distanceValue: 1, distanceUnit: 'marathons' },
        { type: 'time', time: 600 },
        { type: 'time', time: 1800 },
        { type: 'time', time: 3600 },
      ],
    },
    [paceCalculatorKey.toString()]: {
      name: '800m Splits',
      targets: [
        { type: 'distance', distanceValue: 0.4, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
        { type: 'time', time: 600 },
      ],
    },
  }));

  // Assert localStorage entries for the race calculator are correct
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.race-calculator-input'))).toEqual(JSON.stringify({
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 630,
    }));
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.race-calculator-options'))).toEqual(JSON.stringify({
      model: 'RiegelModel',
      riegelExponent: 1.06,
    }));
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.race-calculator-target-set')))
    .toEqual(JSON.stringify('_race_targets'));
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.race-calculator-target-sets'))).toEqual(JSON.stringify({
      _race_targets: {
        name: 'Common Race Targets',
        targets: [
          { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
          { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
          { type: 'distance', distanceValue: 1500, distanceUnit: 'meters' },
          { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
          { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 3000, distanceUnit: 'meters' },
          { type: 'distance', distanceValue: 3200, distanceUnit: 'meters' },
          { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
          { type: 'distance', distanceValue: 6, distanceUnit: 'kilometers' },
          { type: 'distance', distanceValue: 8, distanceUnit: 'kilometers' },
          { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
          { type: 'distance', distanceValue: 15, distanceUnit: 'kilometers' },
          { type: 'distance', distanceValue: 0.5, distanceUnit: 'marathons' },
          { type: 'distance', distanceValue: 1, distanceUnit: 'marathons' },
        ],
      },
    }));

  // Assert localStorage entries for the split calculator are correct
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.split-calculator-target-set')))
    .toEqual(JSON.stringify('_split_targets'));
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.split-calculator-target-sets'))).toEqual(JSON.stringify({
      _split_targets: {
        name: '5K 1600m Splits',
        targets: [
          { type: 'distance', distanceValue: 1.6, distanceUnit: 'kilometers', splitTime: 420 },
          { type: 'distance', distanceValue: 3.2, distanceUnit: 'kilometers', splitTime: 390 },
          { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers', splitTime: 390 },
        ],
      },
    }));

  // Assert localStorage entries for the unit calculator are correct
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.unit-calculator-inputs'))).toEqual(JSON.stringify({
      distance: {
        inputValue: 1,
        inputUnit: 'miles',
        outputUnit: 'kilometers',
      },
      time: {
        inputValue: 1,
        inputUnit: 'seconds',
        outputUnit: 'hh:mm:ss',
      },
      speed_and_pace: {
        inputValue: 10,
        inputUnit: 'kilometers_per_hour',
        outputUnit: 'seconds_per_mile',
      },
    }));

  // Assert localStorage entries for the workout calculator are correct
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.workout-calculator-input'))).toEqual(JSON.stringify({
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 301,
    }));
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.workout-calculator-options'))).toEqual(JSON.stringify({
      customTargetNames: true,
      model: 'VO2MaxModel',
      riegelExponent: 1.06,
    }));
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.workout-calculator-target-set')))
    .toEqual(JSON.stringify('_workout_targets'));
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.workout-calculator-target-sets'))).toEqual(JSON.stringify({
      _workout_targets: {
        name: 'Common Workout Targets',
        targets: [
          {
            splitValue: 400, splitUnit: 'meters',
            type: 'distance', distanceValue: 1, distanceUnit: 'miles',
          },
          {
            splitValue: 800, splitUnit: 'meters',
            type: 'distance', distanceValue: 5, distanceUnit: 'kilometers',
          },
          {
            splitValue: 1600, splitUnit: 'meters',
            type: 'time', time: 3600,
          },
          {
            splitValue: 1, splitUnit: 'miles',
            type: 'distance', distanceValue: 1, distanceUnit: 'marathons',
          },
        ],
      },
    }));

  // Reload app and go to batch calculator
  await page.goto('/');
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
  await expect(page.getByLabel('Target name customization')).toHaveValue("true");
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

  // Reset selected calculator
  await page.getByLabel('Calculator').selectOption('Race Calculator');

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
  // TODO: add unit-calculator-category setting?
  // await expect(page.getByLabel('Output value')).toHaveText('00:09:39.366');

  // Return to workout calculator
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Workout Calculator' }).click();

  // Assert workout splits are correct (input race and prediction model not reset)
  await expect(page.getByRole('row').nth(1)).toHaveText('400 m @ 1 mi' + '1:14.81');
  await expect(page.getByRole('row').nth(3)).toHaveText('1600 m @ 1:00:00' + '5:53.56');
  await expect(page.getByRole('row')).toHaveCount(5);
});

test('v1.4.1 Migration', async ({ page }) => {
  // Structure:
  // - Set v1.4.1 localStorage entries
  // - Reload app and assert the proper migrations were performed

  // Set v1.4.1 localStorage options
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem('running-tools.workout-calculator-options', JSON.stringify({
      // No customTargetNames property
      model: 'VO2MaxModel',
      riegelExponent: 1.06,
    })));

  // Reload the app and assert localStorage is updated
  await page.goto('/');
  await expect(await page.evaluate(() =>
    localStorage.getItem('running-tools.workout-calculator-options'))).toEqual(JSON.stringify({
      model: 'VO2MaxModel',
      riegelExponent: 1.06,
      customTargetNames: false,
    }));

  // Assert target name customization is disabled by default
  await page.getByRole('button', { name: 'Workout Calculator' }).click();
  await page.getByText('Advanced Options').click();
  await expect(page.getByLabel('Target name customization')).toHaveValue('false');
});
