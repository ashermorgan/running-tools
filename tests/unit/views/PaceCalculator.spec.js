import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import PaceCalculator from '@/views/PaceCalculator.vue';
import { defaultTargetSets } from '@/core/targets';

beforeEach(() => {
  localStorage.clear();
});

test('should load global options from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.global-options', JSON.stringify({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
    },
  }));

  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions
    .defaultUnitSystem).to.equal('imperial');
});

test('should load pace options and target sets from localStorage', async () => {
  // Initialize localStorage
  const targetSets = {
    '_pace_targets': {
      name: 'Pace targets #1',
      targets: [
        { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
      ],
    },
    'B': {
      name: 'Pace targets #2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  };
  localStorage.setItem('running-tools.pace-calculator-target-sets', JSON.stringify(targetSets));
  localStorage.setItem('running-tools.pace-calculator-options', JSON.stringify({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  }));

  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Assert selection is loaded
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

test('should save global options to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Change default units
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  }, 'globalOptions');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.global-options')).to.equal(JSON.stringify({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  }));
});

test('should save pace options and target sets to localStorage when modified', async () => {
  const targetSets = {
    '_pace_targets': {
      name: 'Pace targets #1',
      targets: [
        { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
      ],
    },
    'B': {
      name: 'Pace targets #2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  };

  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Update input pace
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });

  // New input pace should be saved to localStorage
  expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(JSON.stringify({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: '_pace_targets',
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

  // New selected target set should be saved to localStorage
  expect(localStorage.getItem('running-tools.pace-calculator-target-sets'))
    .to.equal(JSON.stringify(targetSets));
  expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(JSON.stringify({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  }));
});

test('should correctly calculate time results', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 1,
    distanceUnit: 'kilometers',
    time: 100,
  });

  // Calculate result
  const calculateResult = wrapper.findComponent({ name: 'single-output-table' }).vm.calculateResult;
  const result = calculateResult({
    distanceValue: 20,
    distanceUnit: 'meters',
    type: 'distance',
  });

  // Assert result is correct
  expect(result).to.deep.equal({
    key: '20 m',
    value: '0:02.00',
    pace: '2:41 / mi',
    result: 'value',
    sort: 2,
  });
});

test('should correctly calculate distance results according to global options', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 2,
    distanceUnit: 'miles',
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
  let result = calculateResult({ type: 'time', time: 600 });
  expect(result.key).to.equal('1.61 km');

  // Change default units
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  }, 'globalOptions');

  // Assert result is correct
  result = calculateResult({ type: 'time', time: 600 });
  expect(result.key).to.equal('1.00 mi');
});

test('should not show paces in results table', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Assert paces are not shown in results table
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.showPace).to.equal(false);
});

test('should correctly handle null target set', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Switch to invalid target set
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    input: {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    },
    selectedTargetSet: 'does_not_exist'
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
    selectedTargetSet: '_pace_targets'
  }, 'options');

  // Assert valid targets passed to SingleOutputTable component
  const paceTargets = defaultTargetSets._pace_targets.targets;
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(paceTargets);
});

test('should correctly set AdvancedOptionsInput type prop', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Assert type prop is correctly set
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.type).to.equal('pace');
});
