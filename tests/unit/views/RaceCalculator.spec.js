import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RaceCalculator from '@/views/RaceCalculator.vue';
import { defaultTargetSets } from '@/core/targets';
import { detectDefaultUnitSystem } from '@/core/units';

beforeEach(() => {
  localStorage.clear();
});

test('should initialize options to default values', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert options are initialized
  expect(wrapper.findComponent({ name: 'pace-input' }).vm.modelValue).to.deep.equal({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions).to.deep.equal({
    defaultUnitSystem: detectDefaultUnitSystem(),
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  });
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    input: {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    },
    selectedTargetSet: '_race_targets',
  });
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.targetSets)
    .to.deep.equal({ _race_targets: defaultTargetSets._race_targets });
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(defaultTargetSets._race_targets.targets);
});

test('should load options from localStorage', async () => {
  const targetSets = {
    '_race_targets': {
      name: 'Race targets #1',
      targets: [
        { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
      ],
    },
    'B': {
      name: 'Race targets #2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  };

  // Initialize localStorage
  localStorage.setItem('running-tools.global-options', JSON.stringify({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
    },
  }));
  localStorage.setItem('running-tools.race-calculator-target-sets', JSON.stringify(targetSets));
  localStorage.setItem('running-tools.race-calculator-options', JSON.stringify({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  }));

  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert options are loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions).to.deep.equal({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
    },
  });
  expect(wrapper.findComponent({ name: 'pace-input' }).vm.modelValue).to.deep.equal({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  });
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.targetSets)
    .to.deep.equal(targetSets);
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(targetSets.B.targets);
});

test('should save options to localStorage when modified', async () => {
  const targetSets = {
    '_race_targets': {
      name: 'Race targets #1',
      targets: [
        { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
      ],
    },
    'B': {
      name: 'Race targets #2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  };

  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Update options
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
    },
  }, 'globalOptions');

  // New global options should be saved to localStorage
  expect(localStorage.getItem('running-tools.global-options')).to.equal(JSON.stringify({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
    },
  }));

  // Update input race
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(JSON.stringify({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: '_race_targets',
  }));

  // Update target sets and selected target set
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue(targetSets,
    'targetSets');
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  }, 'options');

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.race-calculator-target-sets'))
    .to.equal(JSON.stringify(targetSets));
  expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(JSON.stringify({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  }));
});

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
  expect(result.pace).to.equal('6:41 / mi');
  expect(result.result).to.equal('value');
  expect(result.sort).to.be.closeTo(2494.80, 0.01);
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
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    input: {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    },
    selectedTargetSet: 'does_not_exist',
  }, 'options');

  // Assert empty array passed to SingleOutputTable component
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets).to.deep.equal([]);

  // Switch to valid target set
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    input: {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    },
    selectedTargetSet: '_race_targets',
  }, 'options');

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
  expect(purdyPoints).to.equal('Purdy points: 454.5');
  expect(vo2).to.equal('V̇O₂: 47.5 ml/kg/min (95.3% of max)')
  expect(vo2Max).to.equal('V̇O₂ Max: 49.8 ml/kg/min')
});

test('should correctly calculate results according to options', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });

  // Set default units
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'metric',
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  }, 'globalOptions');

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
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial', // changed from metric
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  }, 'globalOptions');

  // Assert result is correct
  result = calculateResult({ type: 'time', time: 2495 });
  expect(result.key).to.equal('6.21 mi');
  expect(result.value).to.equal('41:35');
  expect(result.pace).to.equal('6:41 / mi');
  expect(result.result).to.equal('key');
  expect(result.sort).to.equal(2495);

  // Switch model
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'RiegelModel', // changed from the Average Model
      riegelExponent: 1.06,
    },
  }, 'globalOptions');

  // Calculate result
  result = calculateResult({
    distanceValue: 10,
    distanceUnit: 'kilometers',
    type: 'distance',
  });

  // Assert result is correct
  expect(result.value).to.equal('41:41.92');

  // Update Riegel Exponent
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'RiegelModel',
      riegelExponent: 1, // changed from 1.06
    },
  }, 'globalOptions');

  // Calculate result
  result = calculateResult({
    distanceValue: 10,
    distanceUnit: 'kilometers',
    type: 'distance',
  });

  // Assert result is correct
  expect(result.value).to.equal('40:00.00');
});

test('should correctly set AdvancedOptionsInput type prop', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert type prop is correctly set
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.type).to.equal('race');
});
