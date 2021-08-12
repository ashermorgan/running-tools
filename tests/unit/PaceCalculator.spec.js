import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import PaceCalculator from '@/views/PaceCalculator.vue';

describe('PaceCalculator.vue', () => {
  it('results should be correct', async () => {
    // Initialize component
    const wrapper = shallowMount(PaceCalculator);

    // Override input values
    wrapper.setData({
      inputDistance: 1,
      inputUnit: 'kilometer',
      inputTime: 100,
    });

    // Override targets
    await wrapper.setData({ targets: [
      { distanceValue: 10,  distanceUnit: 'meter' },
      { distanceValue: 20,  distanceUnit: 'meter' },
      { distanceValue: 100, distanceUnit: 'meter' },
      { distanceValue: 1,   distanceUnit: 'kilometer' },
    ]});

    // Assert results are correct
    expect(wrapper.vm._computedWatchers.results.value).to.deep.equal([
      { distanceValue: 10,  distanceUnit: 'meter',     time: 1 },
      { distanceValue: 20,  distanceUnit: 'meter',     time: 2 },
      { distanceValue: 100, distanceUnit: 'meter',     time: 10 },
      { distanceValue: 1,   distanceUnit: 'kilometer', time: 100 },
    ]);
  });

  it('results should be sorted by time', async () => {
    // Initialize component
    const wrapper = shallowMount(PaceCalculator);

    // Override input values
    wrapper.setData({
      inputDistance: 1,
      inputUnit: 'kilometer',
      inputTime: 100,
    });

    // Override targets
    await wrapper.setData({ targets: [
      { distanceValue: 20,  distanceUnit: 'meter' },
      { distanceValue: 100, distanceUnit: 'meter' },
      { distanceValue: 1,   distanceUnit: 'kilometer' },
      { distanceValue: 10,  distanceUnit: 'meter' },
    ]});

    // Assert results are correct
    expect(wrapper.vm._computedWatchers.results.value).to.deep.equal([
      { distanceValue: 10,  distanceUnit: 'meter',     time: 1 },
      { distanceValue: 20,  distanceUnit: 'meter',     time: 2 },
      { distanceValue: 100, distanceUnit: 'meter',     time: 10 },
      { distanceValue: 1,   distanceUnit: 'kilometer', time: 100 },
    ]);
  });
});
