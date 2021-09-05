/* eslint-disable no-underscore-dangle */

import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import PaceCalculator from '@/views/PaceCalculator.vue';

describe('views/PaceCalculator.vue', () => {
  it('should correctly calculate times', async () => {
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

  it('should correctly calculate distances', async () => {
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
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 200,
      result: 'distance',
    });
  });
});
