/* eslint-disable no-underscore-dangle */

import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import raceUtils from '@/utils/races';
import unitUtils from '@/utils/units';
import RaceCalculator from '@/views/RaceCalculator.vue';

describe('views/RaceCalculator.vue', () => {
  it('should correctly predict race times', async () => {
    // Initialize component
    const wrapper = shallowMount(RaceCalculator);

    // Override input values
    await wrapper.setData({
      inputDistance: 5,
      inputUnit: 'kilometers',
      inputTime: 1200,
    });

    // Predict race times
    const result = wrapper.vm.predictResult({
      distanceValue: 10,
      distanceUnit: 'kilometers',
      result: 'time',
    });

    // Assert result is correct
    const prediction = raceUtils.AverageModel.predictTime(5000, 1200, 10000);
    expect(result).to.deep.equal({
      distanceValue: 10,
      distanceUnit: 'kilometers',
      time: prediction,
      result: 'time',
    });
  });

  it('should correctly predict race distances', async () => {
    // Initialize component
    const wrapper = shallowMount(RaceCalculator);

    // Override input values
    await wrapper.setData({
      inputDistance: 5,
      inputUnit: 'kilometers',
      inputTime: 1200,
    });

    // Predict race distances
    const result = wrapper.vm.predictResult({
      time: 2460,
      result: 'distance',
    });

    // Assert result is correct
    const prediction = raceUtils.AverageModel.predictDistance(1200, 5000, 2460);
    expect(result).to.deep.equal({
      distanceValue: unitUtils.convertDistance(prediction, 'meters',
        unitUtils.getDefaultDistanceUnit()),
      distanceUnit: unitUtils.getDefaultDistanceUnit(),
      time: 2460,
      result: 'distance',
    });
  });
});
