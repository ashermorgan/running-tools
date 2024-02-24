import { test, expect } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';

test('results should be correct and sorted by time', () => {
  // Initialize component
  const wrapper = shallowMount(SimpleTargetTable, {
    propsData: {
      calculateResult: (row) => ({
        distanceValue: row.distanceValue ? row.distanceValue : row.time + 1,
        distanceUnit: row.distanceUnit ? row.distanceUnit : 'miles',
        time: row.time ? row.time : row.distanceValue + 1,
        result: row.result,
      }),
      targets: [
        { result: 'time', distanceValue: 20, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 100, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 10, distanceUnit: 'meters' },
        { result: 'distance', time: 1 },
        { result: 'distance', time: 10 },
      ],
    },
  });

  // Assert results are correct
  expect(wrapper.vm.results).to.deep.equal([
    { result: 'distance', distanceValue: 2, distanceUnit: 'miles', time: 1 },
    { result: 'time', distanceValue: 1, distanceUnit: 'kilometers', time: 2 },
    { result: 'distance', distanceValue: 11, distanceUnit: 'miles', time: 10 },
    { result: 'time', distanceValue: 10, distanceUnit: 'meters', time: 11 },
    { result: 'time', distanceValue: 20, distanceUnit: 'meters', time: 21 },
    { result: 'time', distanceValue: 100, distanceUnit: 'meters', time: 101 },
  ]);
});

test('getPace should return correct imerial paces', () => {
  // Initialize component
  const wrapper = mount(SimpleTargetTable, {
    propsData: {
      calculateResult: () => {},
      defaultUnitSystem: 'imperial',
    },
  });

  // Assert paces are correct
  const result = wrapper.vm.getPace({
    distanceValue: 1,
    distanceUnit: 'kilometers',
    time: 300,
  });
  expect(result).to.be.closeTo(482.81, 0.01);
});

test('getPace should return correct metric paces', () => {
  // Initialize component
  const wrapper = mount(SimpleTargetTable, {
    propsData: {
      calculateResult: () => {},
      defaultUnitSystem: 'metric',
    },
  });

  // Assert paces are correct
  const result = wrapper.vm.getPace({
    distanceValue: 1,
    distanceUnit: 'miles',
    time: 600,
  });
  expect(result).to.be.closeTo(372.82, 0.01);
});
