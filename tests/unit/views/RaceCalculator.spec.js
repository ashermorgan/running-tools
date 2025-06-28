import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RaceCalculator from '@/views/RaceCalculator.vue';
import { defaultTargetSets } from '@/utils/targets';

beforeEach(() => {
  localStorage.clear();
})

test('should correctly predict race times', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });

  // Calculate result
  const calculateResult = wrapper.findComponent({ name: 'single-output-table' }).vm.calculateResult;
  const result = calculateResult({
    distanceValue: 10,
    distanceUnit: 'kilometers',
    type: 'distance',
  });

  // Assert result is correct
  expect(result.key).to.equal('10 km');
  expect(result.value).to.equal('41:34.80');
  expect(result.pace).to.equal('6:42 / mi');
  expect(result.result).to.equal('value');
  expect(result.sort).to.be.closeTo(2494.80, 0.01);
});

test('should correctly calculate distance results according to default units setting', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });

  // Set default units
  await wrapper.find('select[aria-label="Default units"]').setValue('metric');

  // Get calculate result function
  const calculateResult = wrapper.findComponent({ name: 'single-output-table' }).vm.calculateResult;

  // Assert result is correct
  let result = calculateResult({ type: 'time', time: 2495 });
  expect(result.key).to.equal('10.00 km');
  expect(result.value).to.equal('41:35');
  expect(result.pace).to.equal('4:09 / km');
  expect(result.result).to.equal('key');
  expect(result.sort).to.equal(2495);

  // Change default units
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');

  // Assert result is correct
  result = calculateResult({ type: 'time', time: 2495 });
  expect(result.key).to.equal('6.21 mi');
  expect(result.value).to.equal('41:35');
  expect(result.pace).to.equal('6:41 / mi');
  expect(result.result).to.equal('key');
  expect(result.sort).to.equal(2495);
});

test('should show paces in results table', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert paces are shown in results table
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.showPace).to.equal(true);
});

test('should correctly handle null target set', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Switch to invalid target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('does_not_exist', 'selectedTargetSet');

  // Assert empty array passed to SingleOutputTable component
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets).to.deep.equal([]);

  // Switch to valid target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('_race_targets', 'selectedTargetSet');

  // Assert valid targets passed to SingleOutputTable component
  const raceTargets = defaultTargetSets._race_targets.targets;
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(raceTargets);
});

test('should correctly calculate race statistics', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });

  // Get race statistics
  const raceStats = wrapper.findAll('details')[0];
  const purdyPoints = raceStats.findAll('div')[0].element.textContent.trim();
  const vo2 = raceStats.findAll('div')[1].element.textContent.trim();
  const vo2Max = raceStats.findAll('div')[2].element.textContent.trim();

  // Assert race statistics are correct
  expect(purdyPoints).to.equal('Purdy Points: 454.5');
  expect(vo2).to.equal('V̇O₂: 47.5 ml/kg/min (95.3% of max)')
  expect(vo2Max).to.equal('V̇O₂ Max: 49.8 ml/kg/min')
});

test('should correctly calculate results according to advanced model options', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });

  // Switch model
  await wrapper.findComponent({ name: 'RaceOptionsInput' }).setValue({
    model: 'RiegelModel',
    riegelExponent: 1.06, // default value
  });

  // Calculate result
  const calculateResult = wrapper.findComponent({ name: 'single-output-table' }).vm.calculateResult;
  let result = calculateResult({
    distanceValue: 10,
    distanceUnit: 'kilometers',
    type: 'distance',
  });

  // Assert result is correct
  expect(result.value).to.equal('41:41.92');

  // Update Riegel Exponent
  await wrapper.findComponent({ name: 'RaceOptionsInput' }).setValue({
    model: 'RiegelModel', // existing value
    riegelExponent: 1,
  });

  // Calculate result
  result = calculateResult({
    distanceValue: 10,
    distanceUnit: 'kilometers',
    type: 'distance',
  });

  // Assert result is correct
  expect(result.value).to.equal('40:00.00');
});

test('should load input race from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.race-calculator-input', JSON.stringify({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  }));

  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'pace-input' }).vm.modelValue).to.deep.equal({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });
});

test('should save input race to localStorage', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.race-calculator-input')).to.equal(JSON.stringify({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  }));
});

test('should load selected target set from localStorage', async () => {
  // Initialize localStorage
  const targetSet2 = {
    name: 'Race targets #2',
    targets: [
      { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
    ],
  };
  localStorage.setItem('running-tools.race-calculator-target-sets', JSON.stringify({
    '_race_targets': {
      name: 'Race targets #1',
      targets: [
        { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
      ],
    },
    'B': targetSet2,
  }));
  localStorage.setItem('running-tools.race-calculator-target-set', '"B"');

  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet)
    .to.equal('B');
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(targetSet2.targets);
});

test('should save selected target set to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Select a new target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('B', 'selectedTargetSet');

  // New selected target set should be saved to localStorage
  expect(localStorage.getItem('running-tools.race-calculator-target-set'))
    .to.equal('"B"');
});

test('should save default units setting to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Change default units
  await wrapper.find('select[aria-label="Default units"]').setValue('metric');
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"imperial"');
});

test('should load advanced model options from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.race-calculator-options', JSON.stringify({
    model: 'PurdyPointsModel',
    riegelExponent: 1.2,
  }));

  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'RaceOptionsInput' }).vm.modelValue).to.deep.equal({
    model: 'PurdyPointsModel',
    riegelExponent: 1.2,
  });
});

test('should save advanced model options to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Update advanced model options
  await wrapper.findComponent({ name: 'RaceOptionsInput' }).setValue({
    model: 'CameronModel',
    riegelExponent: 1.30,
  });

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(JSON.stringify({
    model: 'CameronModel',
    riegelExponent: 1.3,
  }));
});

