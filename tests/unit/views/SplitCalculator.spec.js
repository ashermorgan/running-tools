import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SplitCalculator from '@/views/SplitCalculator.vue';

beforeEach(() => {
  localStorage.clear();
})

test('should load selected target set from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-options', JSON.stringify({
    selectedTargetSet: 'B',
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    selectedTargetSet: 'B',
  });
});

test('should load targets from localStorage and pass to splitOutputTable', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify({
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
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert default split targets are initially loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    selectedTargetSet: '_split_targets',
  });
  expect(wrapper.findComponent({ name: 'split-output-table' }).vm.modelValue).to.deep.equal([
    { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
    { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
    { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
  ]);

  // Select a new target set
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    selectedTargetSet: 'B',
  }, 'options');

  // Assert new target set is loaded
  expect(wrapper.findComponent({ name: 'split-output-table' }).vm.modelValue).to.deep.equal([
    { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
    { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
    { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
  ]);
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

test('should update targets in localStorage when modified by splitOutputTable', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 180 },
      ],
    },
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Update split times
  await wrapper.findComponent({ name: 'split-output-table' }).setValue([
    { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
    { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
    { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
  ]);

  // Assert targets correctly saved in localStorage
  expect(localStorage.getItem('running-tools.split-calculator-target-sets')).to.equal(JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
      ],
    },
  }));
});

test('should save selected target set to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Select a new target set
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    selectedTargetSet: '_race_targets',
  }, 'options');

  // New selected target set should be saved to localStorage
  expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(JSON.stringify({
    selectedTargetSet: '_race_targets',
  }));
});

test('should load default units from localStorage and pass to splitOutputTable', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.default-unit-system', '"metric"');

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert default units setting is initialy loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.defaultUnitSystem)
    .to.equal('metric');

  // Assert prop is correct
  expect(wrapper.findComponent({ name: 'split-output-table' }).vm.defaultUnitSystem)
    .to.equal('metric');

  // Change default units
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue('imperial', 'defaultUnitSystem');

  // Assert prop is correct
  expect(wrapper.findComponent({ name: 'split-output-table' }).vm.defaultUnitSystem)
    .to.equal('imperial');
});

test('should save default units setting to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Set default units setting
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue('metric', 'defaultUnitSystem');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"metric"');

  // Set default units setting
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue('imperial', 'defaultUnitSystem');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"imperial"');
});

test('should correctly set AdvancedOptionsInput type prop', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert type prop is correctly set
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.type).to.equal('split');
});
