import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SplitCalculator from '@/views/SplitCalculator.vue';

beforeEach(() => {
  localStorage.clear();
});

test('should load global options from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.global-options', JSON.stringify({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions
    .defaultUnitSystem).to.equal('imperial');
  expect(wrapper.findComponent({ name: 'split-output-table' }).vm.defaultUnitSystem)
    .to.equal('imperial');
});

test('should load local options and target sets from localStorage', async () => {
  // Initialize localStorage
  const targetSets = {
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
    'B': {
      name: 'Split targets #2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
      ],
    },
  };
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify(targetSets));
  localStorage.setItem('running-tools.split-calculator-options', JSON.stringify({
    selectedTargetSet: 'B',
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    selectedTargetSet: 'B',
  });
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.targetSets)
    .to.deep.equal(targetSets);
  expect(wrapper.findComponent({ name: 'split-output-table' }).vm.modelValue)
    .to.deep.equal(targetSets.B.targets);
});

test('should save global options to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Set default units setting
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'metric',
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  }, 'globalOptions');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.global-options')).to.equal(JSON.stringify({
    defaultUnitSystem: 'metric',
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  }));

  // Update default units setting
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

test('should save local options and target sets to localStorage when modified', async () => {
  const targetSets1 = {
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
    'B': {
      name: 'Split targets #2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
      ],
    },
  };
  const targetSets2 = {
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
    'B': {
      name: 'Split targets #2',
      targets: [
        // split times modified:
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 185 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 195 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 205 },
      ],
    },
  };

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Update target sets and selected target set via AdvancedOptionsInput
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue(targetSets1,
    'targetSets');
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    selectedTargetSet: 'B',
  }, 'options');

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.split-calculator-target-sets'))
    .to.equal(JSON.stringify(targetSets1));
  expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(JSON.stringify({
    selectedTargetSet: 'B',
  }));

  // Update target sets via SplitOutputTable
  await wrapper.findComponent({ name: 'split-output-table' }).setValue(targetSets2.B.targets);

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.split-calculator-target-sets'))
    .to.equal(JSON.stringify(targetSets2));
  expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(JSON.stringify({
    selectedTargetSet: 'B',
  }));
});

test('should correctly handle null target set', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-options', JSON.stringify({
    selectedTargetSet: 'does_not_exist',
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    selectedTargetSet: 'does_not_exist',
  });

  // Assert empty array passed to SplitOutputTable
  expect(wrapper.findComponent({ name: 'split-output-table' }).vm.modelValue).to.deep.equal([]);

  // Switch to valid target set
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    selectedTargetSet: '_split_targets',
  }, 'options');

  // Assert non-empty target set passed to SplitOutputTable
  expect(wrapper.findComponent({ name: 'split-output-table' }).vm.modelValue).to.deep.equal([
    { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
    { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
    { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
  ]);
});

test('should correctly set AdvancedOptionsInput type prop', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert type prop is correctly set
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.type).to.equal('split');
});
