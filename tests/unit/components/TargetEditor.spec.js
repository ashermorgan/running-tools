/* eslint-disable no-underscore-dangle */

import { test, expect } from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';
import TargetEditor from '@/components/TargetEditor.vue';

test('addDistanceTarget method should correctly add distance target', async () => {
  // Initialize component
  const wrapper = mount(TargetEditor, {
    propsData: {
      modelValue: [
        { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
        { time: 0, result: 'distance' },
      ],
    },
  });

  // Add distance target
  await wrapper.vm.addDistanceTarget();

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [[
      { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
      { time: 0, result: 'distance' },
      { distanceUnit: 'miles', distanceValue: 1, result: 'time'},
    ]],
  ]);
});

test('addTimeTarget method should correctly add time target', async () => {
  // Initialize component
  const wrapper = mount(TargetEditor, {
    propsData: {
      modelValue: [
        { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
        { time: 0, result: 'distance' },
      ],
    },
  });

  // Add time target
  await wrapper.vm.addTimeTarget();

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [[
      { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
      { time: 0, result: 'distance' },
      { time: 600, result: 'distance' },
    ]],
  ]);
});

test('should emit input event when targets are updated', async () => {
  // Initialize component
  const wrapper = mount(TargetEditor, {
    propsData: {
      modelValue: [
        { distanceUnit: 'miles', distanceValue: 2, result: 'time' },
      ],
    },
  });

  // Update distance value
  await wrapper.find('tbody input').trigger('keydown', { key: 'ArrowUp' });

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [[
      { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
    ]],
  ]);
});

test('removeTarget method should correctly remove target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: [
        { distanceUnit: 'miles', distanceValue: 1, result: 'time' },
        { distanceUnit: 'miles', distanceValue: 2, result: 'time' },
        { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
      ],
    },
  });

  // Remove 2nd target
  await wrapper.vm.removeTarget(1);

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [[
      { distanceUnit: 'miles', distanceValue: 1, result: 'time' },
      { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
    ]],
  ]);
});
