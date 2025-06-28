import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import WorkoutCalculator from '@/views/WorkoutCalculator.vue';
import { defaultTargetSets } from '@/utils/targets';

beforeEach(() => {
  localStorage.clear();
})

test('should correctly predict workout splits', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });

  // Calculate result
  const calculateResult = wrapper.findComponent({ name: 'single-output-table' }).vm.calculateResult;
  const result = calculateResult({
    splitValue: 1, splitUnit: 'kilometers',
    type: 'distance', distanceValue: 10, distanceUnit: 'kilometers',
  });

  // Assert result is correct
  expect(result.key).to.equal('1 km @ 10 km');
  expect(result.value).to.equal('4:09.48');
  expect(result.result).to.equal('value');
  expect(result.sort).to.be.closeTo(249.48, 0.01);
});

test('should correctly handle null target set', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Switch to invalid target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('does_not_exist', 'selectedTargetSet');

  // Assert empty array passed to SingleOutputTable component
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets).to.deep.equal([]);

  // Switch to valid target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('_workout_targets', 'selectedTargetSet');

  // Assert valid targets passed to SingleOutputTable component
  const workoutTargets = defaultTargetSets._workout_targets.targets;
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(workoutTargets);
});

test('should correctly calculate results according to advanced model options', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });

  // Update model and Riegel Exponent
  await wrapper.findComponent({ name: 'RaceOptionsInput' }).setValue({
    model: 'RiegelModel',
    riegelExponent: 1.10,
  });

  // Calculate result
  const calculateResult = wrapper.findComponent({ name: 'single-output-table' }).vm.calculateResult;
  let result = calculateResult({
    customName: 'foo',
    splitValue: 1, splitUnit: 'kilometers',
    type: 'distance', distanceValue: 10, distanceUnit: 'kilometers',
  });

  // Assert result is correct
  expect(result.key).to.equal('1 km @ 10 km');
  expect(result.value).to.equal('4:17.23');
});

test('should load input race from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.workout-calculator-input', JSON.stringify({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  }));

  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'pace-input' }).vm.modelValue).to.deep.equal({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });
});

test('should save input race to localStorage', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.workout-calculator-input')).to.equal(JSON.stringify({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  }));
});

test('should load selected target set from localStorage', async () => {
  // Initialize localStorage
  const targetSet2 = {
    name: 'Workout targets #2',
    targets: [
      {
        distanceUnit: 'miles', distanceValue: 2,
        splitUnit: 'meters', splitValue: 400,
        type: 'distance',
      },
      {
        time: 6000,
        splitUnit: 'kilometers', splitValue: 2,
        type: 'time',
      },
      {
        distanceUnit: 'kilometers', distanceValue: 5,
        splitUnit: 'miles', splitValue: 1,
        type: 'distance'
      },
    ],
  };
  localStorage.setItem('running-tools.workout-calculator-target-sets', JSON.stringify({
    '_workout_targets': {
      name: 'Workout targets #1',
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
          splitValue: 2, splitUnit: 'miles',
          type: 'time', time: 7200,
        },
      ],
    },
    'B': targetSet2,
  }));
  localStorage.setItem('running-tools.workout-calculator-target-set', '"B"');

  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet)
    .to.equal('B');
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(targetSet2.targets);
});

test('should save selected target set to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Select a new target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('B', 'selectedTargetSet');

  // New selected target set should be saved to localStorage
  expect(localStorage.getItem('running-tools.workout-calculator-target-set'))
    .to.equal('"B"');
});

test('should save default units setting to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Change default units
  await wrapper.find('select[aria-label="Default units"]').setValue('metric');
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"imperial"');
});

test('should load advanced model options from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.workout-calculator-options', JSON.stringify({
    model: 'PurdyPointsModel',
    riegelExponent: 1.2,
  }));

  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'RaceOptionsInput' }).vm.modelValue).to.deep.equal({
    model: 'PurdyPointsModel',
    riegelExponent: 1.2,
  });
});

test('should save advanced model options to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Update advanced model options
  await wrapper.findComponent({ name: 'RaceOptionsInput' }).setValue({
    model: 'CameronModel',
    riegelExponent: 1.30,
  });

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(JSON.stringify({
    model: 'CameronModel',
    riegelExponent: 1.3,
  }));
});
