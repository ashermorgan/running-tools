/* eslint-disable no-underscore-dangle */

import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import PaceCalculator from '@/views/PaceCalculator.vue';
import unitUtils from '@/utils/units';

test('should correctly calculate times', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Override input values
  await wrapper.setData({
    inputDistance: 1,
    inputUnit: 'kilometers',
    inputTime: 100,
  });

  // Calculate paces
  const result = wrapper.vm.calculatePace({
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

test('should correctly calculate distances', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceCalculator);

  // Override input values
  await wrapper.setData({
    inputDistance: 1,
    inputUnit: 'miles',
    inputTime: 100,
  });

  // Calculate paces
  const result = wrapper.vm.calculatePace({
    time: 200,
    result: 'distance',
  });

  // Assert result is correct
  expect(result).to.deep.equal({
    distanceValue: unitUtils.convertDistance(2, 'miles', unitUtils.getDefaultDistanceUnit(unitUtils.detectDefaultUnitSystem())),
    distanceUnit: unitUtils.getDefaultDistanceUnit(unitUtils.detectDefaultUnitSystem()),
    time: 200,
    result: 'distance',
  });
});
