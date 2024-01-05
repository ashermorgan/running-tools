/* eslint-disable no-underscore-dangle */

import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

test('Create New Target Set option should correctly add target set', async () => {
  // Initialize component
  const wrapper = mount(TargetSetSelector, {
    data() {
      return {
        internalValue: 'A',
        editingTargetSets: false,
        targetSets: {
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
  wrapper.vm.internalValue = '_new';
  await wrapper.vm.$nextTick();

  // Assert target set was added
  expect(wrapper.vm.targetSets['A']).to.deep.equal({
    name: '1st target set',
    targets: [
      { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
    ],
  });
  const keys = Object.keys(wrapper.vm.targetSets)
  expect(keys.length).to.equal(2);
  expect(wrapper.vm.targetSets[keys[1]]).to.deep.equal({
    name: 'New target set',
    targets: [],
  });

  // Assert new target set was selected
  expect(wrapper.vm.internalValue).to.equal(keys[1]);
});

test('revertTargetSet method should correctly reset target sets', async () => {
  // Initialize component
  const wrapper = mount(TargetSetSelector, {
    data() {
      return {
        internalValue: 'A',
        editingTargetSets: false,
        targetSets: {
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

  // Revert first target set
  await wrapper.vm.revertTargetSet();

  // Assert first target set was removed
  expect(wrapper.vm.targetSets).to.deep.equal({
    '_split_targets': {
      name: '5K Kilometer Splits',
      targets: [
        { result: 'time', distanceValue: 2, distanceUnit: 'Kilometer' },
        { result: 'time', distanceValue: 4, distanceUnit: 'Kilometer' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  });
  expect(wrapper.vm.internalValue).to.equal('_split_targets');

  // Revert second target set
  await wrapper.vm.revertTargetSet();

  // Assert second target set was reset
  expect(wrapper.vm.targetSets).to.deep.equal({
    '_split_targets': {
      name: '5K Mile Splits',
      targets: [
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  });
  expect(wrapper.vm.internalValue).to.equal('_split_targets');
});

test('sortTargetSet method should correctly sort target sets', async () => {
  // Initialize component
  const wrapper = mount(TargetSetSelector, {
    data() {
      return {
        internalValue: '_split_targets',
        editingTargetSets: false,
        targetSets: {
          '_split_targets': {
            name: '5K Mile Splits',
            targets: [
              { result: 'distance', timeValue: 60 },
              { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
              { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
              { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
            ],
          },
        },
      };
    },
  });

  // Sort target set
  await wrapper.vm.sortTargetSet();

  // Assert target set was sorted
  expect(wrapper.vm.targetSets).to.deep.equal({
    '_split_targets': {
      name: '5K Mile Splits',
      targets: [
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'distance', timeValue: 60 },
      ],
    },
  });
});
