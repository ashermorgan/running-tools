/* eslint-disable no-underscore-dangle */

import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';

test('results should be correct and sorted by time', () => {
  // Initialize component
  const wrapper = shallowMount(SimpleTargetTable, {
    propsData: {
      calculateResult: (row) => ({
        distanceValue: row.distanceValue,
        distanceUnit: row.distanceUnit,
        time: row.distanceValue + 1,
      }),
      defaultTargets: [
        { distanceValue: 20, distanceUnit: 'meters' },
        { distanceValue: 100, distanceUnit: 'meters' },
        { distanceValue: 1, distanceUnit: 'kilometers' },
        { distanceValue: 10, distanceUnit: 'meters' },
      ],
    },
  });

  // Assert results are correct
  expect(wrapper.vm.results).to.deep.equal([
    { distanceValue: 1, distanceUnit: 'kilometers', time: 2 },
    { distanceValue: 10, distanceUnit: 'meters', time: 11 },
    { distanceValue: 20, distanceUnit: 'meters', time: 21 },
    { distanceValue: 100, distanceUnit: 'meters', time: 101 },
  ]);
});
