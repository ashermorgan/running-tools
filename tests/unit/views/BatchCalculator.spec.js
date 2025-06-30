import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import BatchCalculator from '@/views/BatchCalculator.vue';

beforeEach(() => {
  localStorage.clear();
})

test('should load input from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.batch-calculator-input', JSON.stringify({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 600,
  }));

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Assert options loaded
  expect(wrapper.findComponent({ name: 'pace-input' }).vm.modelValue).to.deep.equal({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 600,
  });
});

test('should save input to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Update input pace
  await wrapper.findComponent({ name: 'pace-input' }).setValue({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 600,
  });

  // Assert input saved
  expect(localStorage.getItem('running-tools.batch-calculator-input')).to.equal(JSON.stringify({
    distanceValue: 2,
    distanceUnit: 'miles',
    time: 600,
  }));
});

test('should load batch options from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.batch-calculator-options', JSON.stringify({
    calculator: 'race',
    increment: 32,
    rows: 15,
  }));

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Assert options loaded
  expect(wrapper.find('select[aria-label="Calculator"]').element.value).to.equal('race');
  expect(wrapper.findComponent({ name: 'time-input' }).vm.modelValue).to.equal(32);
  expect(wrapper.findComponent({ name: 'integer-input' }).vm.modelValue).to.equal(15);
});

test('should save batch options to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Update active calculator
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');

  // Assert options saved
  expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(JSON.stringify({
    calculator: 'race',
    increment: 15,
    rows: 20,
  }));

  // Update increment value
  await wrapper.findComponent({ name: 'time-input' }).setValue(32);

  // Assert options saved
  expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(JSON.stringify({
    calculator: 'race',
    increment: 32,
    rows: 20,
  }));

  // Update number of rows
  await wrapper.findComponent({ name: 'integer-input' }).setValue(15);

  // Assert options saved
  expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(JSON.stringify({
    calculator: 'race',
    increment: 32,
    rows: 15,
  }));
});

test('should load default units setting from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.default-unit-system', '"metric"');

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Assert default units setting loaded
  expect(wrapper.find('select[aria-label="Default units"]').element.value).to.equal('metric');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.defaultUnitSystem)
    .to.equal('metric');
});

test('should save default units setting from localStorage when modified', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.default-unit-system', '"metric"');

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Change default units setting
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"imperial"');
});

test('should load selected target set from localStorage', async () => {
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
  localStorage.setItem('running-tools.pace-calculator-target-set', '"A"');
  localStorage.setItem('running-tools.race-calculator-target-sets', JSON.stringify({
    'C': selectedTargetSets[1],
    'D': {
      name: 'Race targets #2',
      targets: [
        { type: 'distance', distanceValue: 4, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.race-calculator-target-set', '"C"');
  localStorage.setItem('running-tools.workout-calculator-target-sets', JSON.stringify({
    'E': selectedTargetSets[2],
    'F': {
      name: 'Workout targets #2',
      targets: [
        { type: 'distance', distanceValue: 6, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.workout-calculator-target-set', '"E"');

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Assert selected pace target set is loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('pace');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to.equal('A');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[0].targets);

  // Assert selected race target set is loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to.equal('C');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[1].targets);

  // Assert selected workout target set is loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('workout');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to.equal('E');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[2].targets);
});

test('should save selected target set to localStorage when modified', async () => {
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
  localStorage.setItem('running-tools.pace-calculator-target-set', '"B"');
  localStorage.setItem('running-tools.race-calculator-target-sets', JSON.stringify({
    'C': selectedTargetSets[1],
    'D': {
      name: 'Race targets #2',
      targets: [
        { type: 'distance', distanceValue: 4, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.race-calculator-target-set', '"D"');
  localStorage.setItem('running-tools.workout-calculator-target-sets', JSON.stringify({
    'E': selectedTargetSets[2],
    'F': {
      name: 'Workout targets #2',
      targets: [
        { type: 'distance', distanceValue: 6, distanceUnit: 'miles' },
      ],
    }
  }));
  localStorage.setItem('running-tools.workout-calculator-target-set', '"F"');

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Update selected pace target set
  await wrapper.find('select[aria-label="Calculator"]').setValue('pace');
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue('A', 'selectedTargetSet');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[0].targets);
  expect(localStorage.getItem('running-tools.pace-calculator-target-set')).to.equal('"A"');

  // Assert selected race target set is loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue('C', 'selectedTargetSet');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[1].targets);
  expect(localStorage.getItem('running-tools.race-calculator-target-set')).to.equal('"C"');

  // Assert selected workout target set is loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('workout');
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue('E', 'selectedTargetSet');
  expect(wrapper.findComponent({ name: 'double-output-table' }).vm.targets)
    .to.deep.equal(selectedTargetSets[2].targets);
  expect(localStorage.getItem('running-tools.workout-calculator-target-set')).to.equal('"E"');
});

test('should load advanced model options from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.race-calculator-options', JSON.stringify({
    model: 'PurdyPointsModel',
    riegelExponent: 1.2,
  }));
  localStorage.setItem('running-tools.workout-calculator-options', JSON.stringify({
    model: 'RiegelModel',
    riegelExponent: 1.1,
  }));

  // Initialize component
  const wrapper = shallowMount(BatchCalculator);

  // Assert race prediction options are loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('race');
  expect(wrapper.findComponent({ name: 'RaceOptionsInput' }).vm.modelValue).to.deep.equal({
    model: 'PurdyPointsModel',
    riegelExponent: 1.2,
  });

  // Assert workout prediction options are loaded
  await wrapper.find('select[aria-label="Calculator"]').setValue('workout');
  expect(wrapper.findComponent({ name: 'RaceOptionsInput' }).vm.modelValue).to.deep.equal({
    model: 'RiegelModel',
    riegelExponent: 1.1,
  });
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
});

test('should correctly calculate outputs', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.race-calculator-options', JSON.stringify({
    model: 'PurdyPointsModel',
    riegelExponent: 1.2,
  }));
  localStorage.setItem('running-tools.workout-calculator-options', JSON.stringify({
    model: 'RiegelModel',
    riegelExponent: 1.1,
  }));
  localStorage.setItem('running-tools.default-unit-system', '"imperial"');

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
  expect(result.value).to.equal('5:53');
  expect(result.pace).to.equal('');
  expect(result.sort).to.be.closeTo(353.07, 0.01);
  expect(result.result).to.equal('value');
});
