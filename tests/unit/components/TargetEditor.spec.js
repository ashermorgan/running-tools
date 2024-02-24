import { test, expect } from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';
import TargetEditor from '@/components/TargetEditor.vue';

test('revert method should emit revert event', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor);

  // Call revert method
  await wrapper.vm.revert();

  // Assert revert event was emitted
  expect(wrapper.emitted().revert.length).to.equal(1);
});

test('close method should emit close event', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor);

  // Call close method
  await wrapper.vm.close();

  // Assert close event was emitted
  expect(wrapper.emitted().close.length).to.equal(1);
});

test('addDistanceTarget method should correctly add imperial distance target', async () => {
  // Initialize component
  const wrapper = mount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
          { time: 0, result: 'distance' },
        ],
      },
      defaultUnitSystem: 'imperial'
    },
  });

  // Add distance target
  await wrapper.vm.addDistanceTarget();

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      name: 'My target set',
      targets: [
        { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
        { time: 0, result: 'distance' },
        { distanceUnit: 'miles', distanceValue: 1, result: 'time'},
      ],
    }],
  ]);
});

test('addDistanceTarget method should correctly add metric distance target', async () => {
  // Initialize component
  const wrapper = mount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
          { time: 0, result: 'distance' },
        ],
      },
      defaultUnitSystem: 'metric'
    },
  });

  // Add distance target
  await wrapper.vm.addDistanceTarget();

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      name: 'My target set',
      targets: [
        { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
        { time: 0, result: 'distance' },
        { distanceUnit: 'kilometers', distanceValue: 1, result: 'time'},
      ],
    }],
  ]);
});

test('addTimeTarget method should correctly add time target', async () => {
  // Initialize component
  const wrapper = mount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
          { time: 0, result: 'distance' },
        ],
      },
    },
  });

  // Add time target
  await wrapper.vm.addTimeTarget();

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{ name: 'My target set',
      targets: [
        { distanceUnit: 'miles', distanceValue: 0, result: 'time' },
        { time: 0, result: 'distance' },
        { time: 600, result: 'distance' },
      ],
    }],
  ]);
});

test('Should emit input event when targets are updated', async () => {
  // Initialize component
  const wrapper = mount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 2, result: 'time' },
        ],
      },
    },
  });

  // Update distance value
  wrapper.vm.internalValue.targets[0].distanceValue = 3;
  await wrapper.vm.$nextTick();

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [
      {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
        ],
      },
    ],
  ]);
});

test('Should emit input event when target set name is updated', async () => {
  // Initialize component
  const wrapper = mount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 2, result: 'time' },
        ],
      },
    },
  });

  // Update distance value
  wrapper.vm.internalValue.name = 'My target set #2';
  await wrapper.vm.$nextTick();

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [
      {
        name: 'My target set #2',
        targets: [
          { distanceUnit: 'miles', distanceValue: 2, result: 'time' },
        ],
      },
    ],
  ]);
});

test('removeTarget method should correctly remove target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 1, result: 'time' },
          { distanceUnit: 'miles', distanceValue: 2, result: 'time' },
          { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
        ],
      },
    },
  });

  // Remove 2nd target
  await wrapper.vm.removeTarget(1);

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      name: 'My target set',
      targets: [
        { distanceUnit: 'miles', distanceValue: 1, result: 'time' },
        { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
      ],
    }],
  ]);
});
