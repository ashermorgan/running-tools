import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import PaceCalculator from '@/views/PaceCalculator.vue';
import { defaultTargetSets } from '@/core/targets';

beforeEach(() => {
  localStorage.clear();
})

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

test('should correctly calculate distance results according to default units setting', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 1200,
  });

  // Set default units
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue('metric', 'defaultUnitSystem');

  // Get calculate result function
  const calculateResult = wrapper.findComponent({ name: 'single-output-table' }).vm.calculateResult;

  // Assert result is correct
  let result = calculateResult({ type: 'time', time: 600 });
  expect(result.key).to.equal('1.61 km');

  // Change default units
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue('imperial', 'defaultUnitSystem');

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
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue({ selectedTargetSet: 'does_not_exist' }, 'options');

  // Assert empty array passed to SingleOutputTable component
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets).to.deep.equal([]);

  // Switch to valid target set
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue({ selectedTargetSet: '_pace_targets' }, 'options');

  // Assert valid targets passed to SingleOutputTable component
  const paceTargets = defaultTargetSets._pace_targets.targets;
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(paceTargets);
});

test('should load input pace from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.pace-calculator-input', JSON.stringify({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  }));

  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'pace-input' }).vm.modelValue).to.deep.equal({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });
});

test('should save input pace to localStorage', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.pace-calculator-input')).to.equal(JSON.stringify({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  }));
});

test('should load options from localStorage', async () => {
  // Initialize localStorage
  const targetSet2 = {
    name: 'Pace targets #2',
    targets: [
      { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
    ],
  };
  localStorage.setItem('running-tools.pace-calculator-target-sets', JSON.stringify({
    '_pace_targets': {
      name: 'Pace targets #1',
      targets: [
        { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
        { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
      ],
    },
    'B': targetSet2,
  }));
  localStorage.setItem('running-tools.pace-calculator-options', JSON.stringify({
    selectedTargetSet: 'B',
  }));

  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options)
    .to.deep.equal({ selectedTargetSet: 'B' });
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(targetSet2.targets);
});

test('should save options to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Select a new target set
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue({ selectedTargetSet: 'B' }, 'options');

  // New selected target set should be saved to localStorage
  expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(JSON.stringify({
    selectedTargetSet: 'B',
  }));
});

test('should save default units setting to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Change default units
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue('metric', 'defaultUnitSystem');
  await wrapper.findComponent({ name: 'advanced-options-input' })
    .setValue('imperial', 'defaultUnitSystem');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"imperial"');
});
