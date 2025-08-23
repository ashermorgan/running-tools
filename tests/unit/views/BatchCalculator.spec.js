import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import BatchCalculator from '@/views/BatchCalculator.vue';

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
  const wrapper = shallowMount(BatchCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions).to.deep.equal({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
    },
  });
});

test('should load batch options from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.batch-calculator-options', JSON.stringify({
    calculator: 'race',
    increment: 32,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: 'foo',
    rows: 15,
  }));

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Assert options loaded
  expect(wrapper.find('select[aria-label="Calculator"]').element.value).to.equal('race');
  expect(wrapper.findComponent({ name: 'pace-input' }).vm.modelValue).to.deep.equal({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 600,
  });
  expect(wrapper.findComponent({ name: 'time-input' }).vm.modelValue).to.equal(32);
  expect(wrapper.findComponent({ name: 'integer-input' }).vm.modelValue).to.equal(15);
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.batchOptions).to.deep.equal({
    calculator: 'race',
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    increment: 32,
    label: 'foo',
    rows: 15,
  });
});

test('should load calculator options from localStorage', async () => {
  // Initialize localStorage
  const selectedTargetSets = [
    {
      name: 'Pace targets #1',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
      ],
    },
    {
      name: 'Race targets #1',
      targets: [
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    {
      name: 'Workout targets #1',
      targets: [
        {
          type: 'distance', distanceValue: 5, distanceUnit: 'miles',
          splitValue: 1, splitUnit: 'miles'
        },
      ],
    },
  ];
  localStorage.setItem('running-tools.pace-calculator-target-sets', JSON.stringify({
    'A': selectedTargetSets[0],
    'B': {
      name: 'Pace targets #2',
      targets: [
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.race-calculator-target-sets', JSON.stringify({
    'C': selectedTargetSets[1],
    'D': {
      name: 'Race targets #2',
      targets: [
        { type: 'distance', distanceValue: 4, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.workout-calculator-target-sets', JSON.stringify({
    'E': selectedTargetSets[2],
    'F': {
      name: 'Workout targets #2',
      targets: [
        { type: 'distance', distanceValue: 6, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.pace-calculator-options', JSON.stringify({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 300,
    },
    selectedTargetSet: 'A',
  }));
  localStorage.setItem('running-tools.race-calculator-options', JSON.stringify({
    input: {
      distanceValue: 1.1,
      distanceUnit: 'miles',
      time: 310,
    },
    selectedTargetSet: 'C',
  }));
  localStorage.setItem('running-tools.workout-calculator-options', JSON.stringify({
    customTargetNames: true,
    input: {
      distanceValue: 1.2,
      distanceUnit: 'miles',
      time: 320,
    },
    selectedTargetSet: 'E',
  }));

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Assert pace calculator options are loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('pace');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    input: {
      distanceValue: 1.0,
      distanceUnit: 'miles',
      time: 300,
    },
    selectedTargetSet: 'A',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[0].targets);

  // Assert race calculator options are loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    input: {
      distanceValue: 1.1,
      distanceUnit: 'miles',
      time: 310,
    },
    selectedTargetSet: 'C',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[1].targets);

  // Assert workout calculator options are loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('workout');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    customTargetNames: true,
    input: {
      distanceValue: 1.2,
      distanceUnit: 'miles',
      time: 320,
    },
    selectedTargetSet: 'E',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[2].targets);
});

test('should save global options to localStorage when modified', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.default-unit-system', '"metric"');

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Change default units setting
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'CameronModel',
      riegelExponent: 1.30,
    },
  }, 'globalOptions');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.global-options')).to.equal(JSON.stringify({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'CameronModel',
      riegelExponent: 1.30,
    },
  }));
});

test('should save batch options to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Update input pace
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 600,
  });

  // Assert options saved
  expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(JSON.stringify({
    calculator: 'workout',
    increment: 15,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: '',
    rows: 20,
  }));

  // Update increment value
  await wrapper.findComponent({ name: 'time-input' }).setValue(32);

  // Assert options saved
  expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(JSON.stringify({
    calculator: 'workout',
    increment: 32,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: '',
    rows: 20,
  }));

  // Update number of rows
  await wrapper.findComponent({ name: 'integer-input' }).setValue(15);

  // Assert options saved
  expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(JSON.stringify({
    calculator: 'workout',
    increment: 32,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: '',
    rows: 15,
  }));

  // Update batch column label
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    calculator: 'workout',
    increment: 32,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: 'foo',
    rows: 15,
  }, 'batch-options');

  // Assert options saved
  expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(JSON.stringify({
    calculator: 'workout',
    increment: 32,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: 'foo',
    rows: 15,
  }));

  // Update active calculator
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');

  // Assert options saved
  expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(JSON.stringify({
    calculator: 'race',
    increment: 32,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: 'foo',
    rows: 15,
  }));
});

test('should save calculator options to localStorage when modified', async () => {
  // Initialize localStorage
  const selectedTargetSets = [
    {
      name: 'Pace targets #1',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
      ],
    },
    {
      name: 'Race targets #1',
      targets: [
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    {
      name: 'Workout targets #1',
      targets: [
        {
          type: 'distance', distanceValue: 5, distanceUnit: 'miles',
          splitValue: 1, splitUnit: 'miles'
        },
      ],
    },
  ];
  localStorage.setItem('running-tools.pace-calculator-target-sets', JSON.stringify({
    'A': selectedTargetSets[0],
    'B': {
      name: 'Pace targets #2',
      targets: [
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.pace-calculator-options', JSON.stringify({
    input: {
      distanceValue: 1,
      distanceUnit: 'miles',
      time: 300,
    },
    selectedTargetSet: 'B',
  }));
  localStorage.setItem('running-tools.race-calculator-target-sets', JSON.stringify({
    'C': selectedTargetSets[1],
    'D': {
      name: 'Race targets #2',
      targets: [
        { type: 'distance', distanceValue: 4, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.race-calculator-options', JSON.stringify({
    input: {
      distanceValue: 1.1,
      distanceUnit: 'miles',
      time: 310,
    },
    selectedTargetSet: 'D',
  }));
  localStorage.setItem('running-tools.workout-calculator-target-sets', JSON.stringify({
    'E': selectedTargetSets[2],
    'F': {
      name: 'Workout targets #2',
      targets: [
        { type: 'distance', distanceValue: 6, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.workout-calculator-options', JSON.stringify({
    customWorkoutNames: false,
    input: {
      distanceValue: 1.2,
      distanceUnit: 'miles',
      time: 320,
    },
    selectedTargetSet: 'F',
  }));

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Update pace calculator options X
  await wrapper.find('select[aria-label="Calculator"]').setValue('pace');
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    input: {
      distanceValue: 1.0,
      distanceUnit: 'miles',
      time: 300,
    },
    selectedTargetSet: 'A',
  }, 'options');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[0].targets);

  // Update race calculator options
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    input: {
      distanceValue: 1.1,
      distanceUnit: 'miles',
      time: 310,
    },
    selectedTargetSet: 'C',
  }, 'options');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[1].targets);

  // Update workout calculator options
  await wrapper.find('select[aria-label="Calculator"]').setValue('workout');
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    customTargetNames: true,
    input: {
      distanceValue: 1.2,
      distanceUnit: 'miles',
      time: 320,
    },
    selectedTargetSet: 'E',
  }, 'options');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[2].targets);

  // Assert options saved to localStorage
  expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(JSON.stringify({
    input: {
      distanceValue: 1.0,
      distanceUnit: 'miles',
      time: 300,
    },
    selectedTargetSet: 'A',
  }));
  expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(JSON.stringify({
    input: {
      distanceValue: 1.1,
      distanceUnit: 'miles',
      time: 310,
    },
    selectedTargetSet: 'C',
  }));
  expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(JSON.stringify({
    customTargetNames: true,
    input: {
      distanceValue: 1.2,
      distanceUnit: 'miles',
      time: 320,
    },
    selectedTargetSet: 'E',
  }));
});

test('should pass correct input props to DoubleOutputTable', async () => {
  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Assert that initial props are correct
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputDistance).to.deep.equal({
    distanceValue: 5,
    distanceUnit: 'kilometers',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputTimes).to.deep.equal([
    1200, 1215, 1230, 1245, 1260, 1275, 1290, 1305, 1320, 1335,
    1350, 1365, 1380, 1395, 1410, 1425, 1440, 1455, 1470, 1485,
  ]);
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.label).to.equal('5 km');

  // Change input pace
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 600,
  });

  // Assert that the props are updated
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputDistance).to.deep.equal({
    distanceValue: 2,
    distanceUnit: 'miles',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputTimes).to.deep.equal([
    600, 615, 630, 645, 660, 675, 690, 705, 720, 735,
    750, 765, 780, 795, 810, 825, 840, 855, 870, 885,
  ]);
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.label).to.equal('2 mi');

  // Change increment value
  await wrapper.findComponent({ name: 'time-input' }).setValue(10);

  // Assert that the props are updated
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputDistance).to.deep.equal({
    distanceValue: 2,
    distanceUnit: 'miles',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputTimes).to.deep.equal([
    600, 610, 620, 630, 640, 650, 660, 670, 680, 690,
    700, 710, 720, 730, 740, 750, 760, 770, 780, 790,
  ]);
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.label).to.equal('2 mi');

  // Change number of rows
  await wrapper.findComponent({ name: 'integer-input' }).setValue(15);

  // Assert that the props are updated
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputDistance).to.deep.equal({
    distanceValue: 2,
    distanceUnit: 'miles',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputTimes).to.deep.equal([
    600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740,
  ]);
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.label).to.equal('2 mi');

  // Enter custom batch column label
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    calculator: 'workout',
    increment: 10,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: 'foo',
    rows: 15,
  }, 'batchOptions');

  // Assert that the props are updated
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputDistance).to.deep.equal({
    distanceValue: 2,
    distanceUnit: 'miles',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputTimes).to.deep.equal([
    600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740,
  ]);
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.label).to.equal('2 mi');

  // Enable target name customization
  await wrapper.findComponent({ name: 'advanced-options-input' }).setValue({
    customTargetNames: true,
    input: {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    },
    selectedTargetSet: '_workout_targets',
  }, 'options');

  // Assert that the props are updated
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputDistance).to.deep.equal({
    distanceValue: 2,
    distanceUnit: 'miles',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputTimes).to.deep.equal([
    600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740,
  ]);
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.label).to.equal('foo');

  // Switch calculators
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');

  // Assert that the props are updated
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputDistance).to.deep.equal({
    distanceValue: 2,
    distanceUnit: 'miles',
  });
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.inputTimes).to.deep.equal([
    600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740,
  ]);
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.label).to.equal('2 mi');
});

test('should correctly set AdvancedOptionsInput props', async () => {
  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Set input pace and batch options
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 600,
  });
  await wrapper.findComponent({ name: 'time-input' }).setValue(32);
  await wrapper.findComponent({ name: 'integer-input' }).setValue(15);

  // Assert batch props are correct
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.batchOptions).to.deep.equal({
    calculator: 'workout',
    increment: 32,
    input: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    label: '',
    rows: 15,
  });

  // Assert props are correct for pace calculator
  await wrapper.find('select[aria-label="Calculator"]').setValue('pace');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.type).to.equal('pace');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions).to.deep.equal({
    defaultUnitSystem: 'imperial',
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
    selectedTargetSet: '_pace_targets',
  });

  // Assert props are correct for race calculator
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.type).to.equal('race');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions).to.deep.equal({
    defaultUnitSystem: 'imperial',
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

  // Assert props are correct for workout calculator
  await wrapper.find('select[aria-label="Calculator"]').setValue('workout');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.type).to.equal('workout');
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.globalOptions).to.deep.equal({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'AverageModel',
      riegelExponent: 1.06,
    },
  });
  expect(wrapper.findComponent({ name: 'advanced-options-input' }).vm.options).to.deep.equal({
    customTargetNames: false,
    input: {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    },
    selectedTargetSet: '_workout_targets',
  });
});

test('should correctly calculate outputs', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.global-options', JSON.stringify({
    defaultUnitSystem: 'imperial',
    racePredictionOptions: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
    },
  }));
  localStorage.setItem('running-tools.race-calculator-options', JSON.stringify({
    input: {
      distanceValue: 1.1,
      distanceUnit: 'miles',
      time: 310,
    },
    selectedTargetSet: '_race_targets',
  }));
  localStorage.setItem('running-tools.workout-calculator-options', JSON.stringify({
    customTargetNames: false,
    input: {
      distanceValue: 1.2,
      distanceUnit: 'miles',
      time: 320,
    },
    selectedTargetSet: '_workout_targets',
  }));

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);
  const input = { distanceValue: 2, distanceUnit: 'miles', time: 600 };

  // Assert pace outputs are calculated correctly
  await wrapper.find('select[aria-label="Calculator"]').setValue('pace');
  let calculate = wrapper.findComponent({ name: 'double-output-table' }).vm.calculateResult;
  expect(calculate(input, { type: 'time', time: 3600 })).to.deep.equal({
    key: '12.00 mi',
    value: '1:00:00',
    pace: '5:00 / mi',
    sort: 3600,
    result: 'key',
  });

  // Assert race outputs are calculated correctly
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');
  calculate = wrapper.findComponent({ name: 'double-output-table' }).vm.calculateResult;
  expect(calculate(input, { type: 'time', time: 3600 })).to.deep.equal({
    key: '10.93 mi',
    value: '1:00:00',
    pace: '5:29 / mi',
    sort: 3600,
    result: 'key',
  });

  // Assert workout outputs are calculated correctly
  await wrapper.find('select[aria-label="Calculator"]').setValue('workout');
  calculate = wrapper.findComponent({ name: 'double-output-table' }).vm.calculateResult;
  const workoutTarget = { type: 'time', time: 3600, splitValue: 1, splitUnit: 'miles' };
  const result = calculate(input, workoutTarget);
  expect(result.key).to.equal('1 mi @ 1:00:00');
  expect(result.value).to.equal('5:29');
  expect(result.pace).to.equal('');
  expect(result.sort).to.be.closeTo(329.48, 0.01);
  expect(result.result).to.equal('value');
});
