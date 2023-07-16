/* eslint-disable no-underscore-dangle */

import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import unitUtils from '@/utils/units';
import UnitCalculator from '@/views/UnitCalculator.vue';

test('should correctly update controls when category changes', async () => {
  // Initialize component
  const wrapper = shallowMount(UnitCalculator);

  // Change category
  await wrapper.setData({ category: 'time' });

  // Assert controls are correct
  expect(wrapper.vm.inputValue).to.equal(1);
  expect(wrapper.vm.inputUnit).to.equal('seconds');
  expect(wrapper.vm.outputUnit).to.equal('hh:mm:ss');

  // Change category
  await wrapper.setData({ category: 'speed_and_pace' });

  // Assert controls are correct
  expect(wrapper.vm.inputValue).to.equal(
    unitUtils.getDefaultPaceUnit() === 'seconds_per_mile' ? 600 : 300,
  );
  expect(wrapper.vm.inputUnit).to.equal(unitUtils.getDefaultPaceUnit());
  expect(wrapper.vm.outputUnit).to.equal(unitUtils.getDefaultSpeedUnit());

  // Change category
  await wrapper.setData({ category: 'distance' });

  // Assert controls are correct
  expect(wrapper.vm.inputValue).to.equal(1);
  expect(wrapper.vm.inputUnit).to.equal('miles');
  expect(wrapper.vm.outputUnit).to.equal('kilometers');
});

test('outputValue should be correct', async () => {
  // Initialize component
  const wrapper = shallowMount(UnitCalculator);

  // Change category and update input
  await wrapper.setData({ category: 'distance' });
  await wrapper.setData({
    inputValue: 2,
    inputUnit: 'kilometers',
    outputUnit: 'meters',
  });

  // Assert controls are correct
  expect(wrapper.vm.outputValue).to.equal(2000);

  // Change category and update input
  await wrapper.setData({ category: 'time' });
  await wrapper.setData({
    inputValue: 3,
    inputUnit: 'minutes',
    outputUnit: 'seconds',
  });

  // Assert controls are correct
  expect(wrapper.vm.outputValue).to.equal(3 * 60);

  // Change category and update input
  await wrapper.setData({ category: 'speed_and_pace' });
  await wrapper.setData({
    inputValue: 2,
    inputUnit: 'miles_per_hour',
    outputUnit: 'seconds_per_mile',
  });

  // Assert controls are correct
  expect(wrapper.vm.outputValue).to.be.closeTo(30 * 60, 0.001);
});

test('should correctly convert to and from hh:mm:ss', async () => {
  // Initialize component
  const wrapper = shallowMount(UnitCalculator);

  // Change category and update input
  await wrapper.setData({ category: 'time' });
  await wrapper.setData({
    inputValue: 60,
    inputUnit: 'hh:mm:ss',
    outputUnit: 'minutes',
  });

  // Assert controls are correct
  expect(wrapper.vm.outputValue).to.equal(1);

  // Update input
  await wrapper.setData({
    inputValue: 1,
    inputUnit: 'minutes',
    outputUnit: 'hh:mm:ss',
  });

  // Assert controls are correct
  expect(wrapper.vm.outputValue).to.equal(60);
});
