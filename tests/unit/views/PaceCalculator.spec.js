import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import PaceCalculator from '@/views/PaceCalculator.vue';

beforeEach(() => {
  localStorage.clear();
})

test('should correctly calculate time results', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(1);
  await wrapper.find('select[aria-label="Input distance unit"]').setValue('kilometers');
  await wrapper.findComponent({ name: 'time-input' }).setValue(100);

  // Calculate result
  const calculateResult = wrapper.findComponent({ name: 'simple-target-table' }).vm.calculateResult;
  const result = calculateResult({
    distanceValue: 20,
    distanceUnit: 'meters',
    result: 'time',
  });

  // Assert result is correct
  expect(result).to.deep.equal({
    distanceValue: 20,
    distanceUnit: 'meters',
    time: 2,
    result: 'time',
  });
});

test('should correctly calculate distance results according to default units setting', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator, {
    data() {
      return {
        defaultUnitSystem: 'metric',
      };
    },
  });

  // Enter input pace data
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(2);
  await wrapper.find('select[aria-label="Input distance unit"]').setValue('miles');
  await wrapper.findComponent({ name: 'time-input' }).setValue(1200);

  // Get calculate result function
  const calculateResult = wrapper.findComponent({ name: 'simple-target-table' }).vm.calculateResult;

  // Assert result is correct
  let result = calculateResult({ result: 'distance', time: 600 });
  expect(result.distanceValue).to.be.closeTo(1.609, 0.001);
  expect(result.distanceUnit).to.equal('kilometers');

  // Change default units
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');

  // Assert result is correct
  result = calculateResult({ result: 'distance', time: 600 });
  expect(result.distanceValue).to.equal(1);
  expect(result.distanceUnit).to.equal('miles');
  expect(result.time).to.equal(600);
  expect(result.result).to.equal('distance');
});

test('should not show paces in results table', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Assert paces are not shown in results table
  expect(wrapper.findComponent({ name: 'simple-target-table' }).vm.showPace).to.equal(false);
});

test('should correctly handle null target set', async () => {
  // Initialize component
  const paceTargets = [
    { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
    { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
    { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
  ];
  const wrapper = shallowMount(PaceCalculator, {
    data() {
      return {
        targetSets: {
          '_pace_targets': {
            name: 'Common pace targets',
            targets: paceTargets,
          },
          '_race_targets': null,
        },
      };
    },
  });

  // Switch to invalid target set
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue('_race_targets');

  // Assert empty array passed to SimpleTargetTable component
  expect(wrapper.findComponent({ name: 'simple-target-table' }).vm.targets).to.deep.equal([]);

  // Switch to valid target set
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue('_pace_targets');

  // Assert valid targets passed to SimpleTargetTable component
  expect(wrapper.findComponent({ name: 'simple-target-table' }).vm.targets).to.deep.equal(paceTargets);
});

test('should load input pace from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.pace-calculator-input-distance', '1');
  localStorage.setItem('running-tools.pace-calculator-input-unit', '"miles"');
  localStorage.setItem('running-tools.pace-calculator-input-time', '600');

  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1);
  expect(wrapper.find('select[aria-label="Input distance unit"]').element.value).to.equal('miles');
  expect(wrapper.findComponent({ name: 'time-input' }).vm.modelValue).to.equal(600);
});

test('should save input pace to localStorage', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(1);
  await wrapper.find('select[aria-label="Input distance unit"]').setValue('miles');
  await wrapper.findComponent({ name: 'time-input' }).setValue(600);

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.pace-calculator-input-distance')).to.equal('1');
  expect(localStorage.getItem('running-tools.pace-calculator-input-unit')).to.equal('"miles"');
  expect(localStorage.getItem('running-tools.pace-calculator-input-time')).to.equal('600');
});

test('should load selected target set from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.pace-calculator-target-set', '"_race_targets"');

  // Initialize component
  const raceTargets = [
    { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
    { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
    { result: 'time', distanceValue: 6, distanceUnit: 'kilometers' },
  ];
  const wrapper = shallowMount(PaceCalculator, {
    data() {
      return {
        targetSets: {
          '_pace_targets': {
            name: 'Common pace targets',
            targets: [
              { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
            ],
          },
          '_race_targets': {
            name: 'Common race targets',
            targets: raceTargets,
          },
        },
      };
    },
  });

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.modelValue).to.equal('_race_targets');
  expect(wrapper.findComponent({ name: 'simple-target-table' }).vm.targets).to.deep.equal(raceTargets);
});

test('should save selected target set to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Select a new target set
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue('_race_targets');

  // New selected target set should be saved to localStorage
  expect(localStorage.getItem('running-tools.pace-calculator-target-set')).to.equal('"_race_targets"');
});

test('should save default units setting to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator, {
    data() {
      return {
        defaultUnitSystem: 'metric',
      };
    },
  });

  // Change default units
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"imperial"');
});
