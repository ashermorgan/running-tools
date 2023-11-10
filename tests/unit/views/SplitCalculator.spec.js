/* eslint-disable no-underscore-dangle */

import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SplitCalculator from '@/views/SplitCalculator.vue';
import unitUtils from '@/utils/units';

test('should correctly calculate split paces and total times', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Override input values
  await wrapper.setData({
    targets: [
      { result: 'time', distanceValue: 2, distanceUnit: 'miles', split: 60 },
      { result: 'time', distanceValue: 4, distanceUnit: 'miles', split: 70 },
      { result: 'time', distanceValue: 10, distanceUnit: 'kilometers', split: 80 },
    ],
  });

  // Assert results are correct
  const final_split_distance = 10000 - unitUtils.convertDistance(4, 'miles', 'meters');
  const final_split_pace = unitUtils.convertPace(80 / final_split_distance, 'seconds_per_meter',
    'seconds_per_mile')
  expect(wrapper.vm.results[0].totalTime).to.equal(60);
  expect(wrapper.vm.results[0].pace).to.equal(30);
  expect(wrapper.vm.results[1].totalTime).to.equal(130);
  expect(wrapper.vm.results[1].pace).to.equal(35);
  expect(wrapper.vm.results[2].totalTime).to.equal(210);
  expect(final_split_pace - wrapper.vm.results[2].pace).to.lessThan(0.00001);
});
