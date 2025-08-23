import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import WorkoutCalculator from '@/views/WorkoutCalculator.vue';
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
  const wrapper = shallowMount(WorkoutCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions).to.deep.equal({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
    },
  });
});

test('should load workout options and target sets from localStorage', async () => {
  // Initialize localStorage
  const targetSets = {
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
    'B': {
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
    },
  };
  localStorage.setItem('running-tools.workout-calculator-target-sets', JSON.stringify(targetSets));
  localStorage.setItem('running-tools.workout-calculator-options', JSON.stringify({
    customTargetNames: true,
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  }));

  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    customTargetNames: true,
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
  const wrapper = shallowMount(WorkoutCalculator);

  // Update options
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'CameronModel',
      riegelExponent: 1.3,
    },
  }, 'globalOptions');

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.global-options')).to.equal(JSON.stringify({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'CameronModel',
      riegelExponent: 1.3,
    },
  }));
});

test('should save workout options and target sets to localStorage when modified', async () => {
  const targetSets = {
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
    'B': {
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
    },
  };

  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Update input race
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(JSON.stringify({
    customTargetNames: false,
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: '_workout_targets',
  }));

  // Update target name customization
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    customTargetNames: true,
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: '_workout_targets',
  }, 'options');

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(JSON.stringify({
    customTargetNames: true,
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: '_workout_targets',
  }));

  // Update target sets and selected target set
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue(targetSets,
    'targetSets');
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    customTargetNames: true,
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  }, 'options');

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.workout-calculator-target-sets'))
    .to.equal(JSON.stringify(targetSets));
  expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(JSON.stringify({
    customTargetNames: true,
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 600,
    },
    selectedTargetSet: 'B',
  }));
});

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
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    customTargetNames: false,
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
    customTargetNames: false,
    input: {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    },
    selectedTargetSet: '_workout_targets',
  }, 'options');

  // Assert valid targets passed to SingleOutputTable component
  const workoutTargets = defaultTargetSets._workout_targets.targets;
  expect(wrapper.findComponent({ name: 'single-output-table' }).vm.targets)
    .to.deep.equal(workoutTargets);
});

test('should correctly calculate results according to options', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Enter input race data
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  });

  // Update model and Riegel exponent
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'RiegelModel',
      riegelExponent: 1.10,
    },
  }, 'globalOptions');

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

  // Update target name customization
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    customTargetNames: true,
    input: {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    },
    selectedTargetSet: '_workout_targets',
  }, 'options');

  // Calculate result
  result = calculateResult({
    customName: 'foo',
    splitValue: 1, splitUnit: 'kilometers',
    type: 'distance', distanceValue: 10, distanceUnit: 'kilometers',
  });

  // Assert result is correct
  expect(result.key).to.equal('foo');
  expect(result.value).to.equal('4:17.23');
});

test('should correctly set AdvancedOptionsInput type prop', async () => {
  // Initialize component
  const wrapper = shallowMount(WorkoutCalculator);

  // Assert type prop is correctly set
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.type).to.equal('workout');
});
