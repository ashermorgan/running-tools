/* eslint-disable no-underscore-dangle */

import { test, expect } from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';
import TargetSetEditor from '@/components/TargetSetEditor.vue';
import targetUtils from '@/utils/targets';

test('addTargetSet method should correctly add target set', async () => {
  // Initialize component
  const wrapper = mount(TargetSetEditor, {
    data() {
      return {
        internalValue: {
          'A': {
            name: '1st target set',
            targets: [
              { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
            ],
          },
        },
      };
    },
  });

  // Add target set
  await wrapper.vm.addTargetSet();

  // Assert target set was added
  expect(wrapper.vm.internalValue['A']).to.deep.equal({
    name: '1st target set',
    targets: [
      { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
    ],
  });
  const keys = Object.keys(wrapper.vm.internalValue)
  expect(keys.length).to.equal(2);
  expect(wrapper.vm.internalValue[keys[1]]).to.deep.equal({
    name: 'New target set',
    targets: [],
  });

  // Assert new target set was selected
  expect(wrapper.vm.selectedTargetSet).to.equal(keys[1]);
});

test('reset method should correctly reset target sets', async () => {
  // Initialize component
  const wrapper = mount(TargetSetEditor, {
    data() {
      return {
        internalValue: {
          'A': {
            name: '1st target set',
            targets: [
              { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
            ],
          },
          '_split_targets': {
            name: '5K Kilometer Splits',
            targets: [
              { result: 'time', distanceValue: 2, distanceUnit: 'Kilometer' },
              { result: 'time', distanceValue: 4, distanceUnit: 'Kilometer' },
              { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
            ],
          },
        },
      };
    },
  });

  // Reset target sets
  await wrapper.vm.reset();

  // Assert target sets were reset
  expect(wrapper.vm.internalValue).to.deep.equal({
    // Default target sets should be restored
    ...targetUtils.defaultTargetSets,

    // Custom target sets should be kept
    'A': {
      name: '1st target set',
      targets: [
          { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
          { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
          { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
  });
});

test('removeTargetSet method should correctly remove target set', async () => {
  // Initialize component
  const wrapper = mount(TargetSetEditor, {
    data() {
      return {
        internalValue: {
          'A': {
            name: '1st target set',
            targets: [
              { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
            ],
          },
          'B': {
            name: '2nd target set',
            targets: [
              { result: 'time', distanceValue: 4, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 5, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 6, distanceUnit: 'miles' },
            ],
          },
          'C': {
            name: '3rd target set',
            targets: [
              { result: 'time', distanceValue: 7, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 8, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 9, distanceUnit: 'miles' },
            ],
          },
        },
      };
    },
  });

  // Remove 2nd target set
  await wrapper.vm.removeTargetSet('B');

  // Assert target set was removed
  expect(wrapper.vm.internalValue).to.deep.equal({
    'A': {
      name: '1st target set',
      targets: [
          { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
          { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
          { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    'C': {
      name: '3rd target set',
      targets: [
        { result: 'time', distanceValue: 7, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 8, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 9, distanceUnit: 'miles' },
      ],
    },
  });
});
