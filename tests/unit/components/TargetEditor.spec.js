import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TargetEditor from '@/components/TargetEditor.vue';

test('should correctly render target set', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'kilometers', distanceValue: 1.61, type: 'distance' },
          { distanceUnit: 'miles', distanceValue: 3.11, type: 'distance' },
          { time: 600, type: 'time' },
        ],
      },
    },
  });

  // Assert target set correctly rendered
  expect(wrapper.find('input').element.value).to.equal('My target set');
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1.61);
  expect(rows[0].find('select').element.value).to.equal('kilometers');
  expect(rows[1].findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(3.11);
  expect(rows[1].find('select').element.value).to.equal('miles');
  expect(rows[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(600);
  expect(rows.length).to.equal(3);
});

test('revert button should emit revert event', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor);

  // Click revert button
  await wrapper.find('button[title="Revert target set"]').trigger('click');

  // Assert revert event was emitted
  expect(wrapper.emitted().revert.length).to.equal(1);
});

test('delete button should emit revert event', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      isCustomSet: true,
    }
  });

  // Click delete button
  await wrapper.find('button[title="Delete target set"]').trigger('click');

  // Assert revert event was emitted
  expect(wrapper.emitted().revert.length).to.equal(1);
});

test('close button should emit close event', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor);

  // Call close method
  await wrapper.find('button[title="Close"]').trigger('click');

  // Assert close event was emitted
  expect(wrapper.emitted().close.length).to.equal(1);
});

test('add distance target button should correctly add imperial distance target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 0, type: 'distance' },
          { time: 0, type: 'time' },
        ],
      },
      defaultUnitSystem: 'imperial'
    },
  });

  // Add distance target
  await wrapper.find('button[title="Add distance target"]').trigger('click');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      name: 'My target set',
      targets: [
        { distanceUnit: 'miles', distanceValue: 0, type: 'distance' },
        { time: 0, type: 'time' },
        { distanceUnit: 'miles', distanceValue: 1, type: 'distance'},
      ],
    }],
  ]);
});

test('add distance target button should correctly add metric distance target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 0, type: 'distance' },
          { time: 0, type: 'time' },
        ],
      },
      defaultUnitSystem: 'metric'
    },
  });

  // Add distance target
  await wrapper.find('button[title="Add distance target"]').trigger('click');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      name: 'My target set',
      targets: [
        { distanceUnit: 'miles', distanceValue: 0, type: 'distance' },
        { time: 0, type: 'time' },
        { distanceUnit: 'kilometers', distanceValue: 1, type: 'distance'},
      ],
    }],
  ]);
});

test('add time target button should correctly add time target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 0, type: 'distance' },
          { time: 0, type: 'time' },
        ],
      },
    },
  });

  // Add time target
  await wrapper.find('button[title="Add time target"]').trigger('click');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{ name: 'My target set',
      targets: [
        { distanceUnit: 'miles', distanceValue: 0, type: 'distance' },
        { time: 0, type: 'time' },
        { time: 600, type: 'time' },
      ],
    }],
  ]);
});

test('add time target button should be hidden for split target sets', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 1, type: 'distance' },
          { distanceUnit: 'miles', distanceValue: 2, type: 'distance' },
        ],
      },
      setType: 'split',
    },
  });

  // Add time target
  expect(wrapper.findAll('button[title="Add time target"]')).toHaveLength(0);
});

test('Should emit input event when targets are updated', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 2, type: 'distance' },
        ],
      },
    },
  });

  // Update distance value
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(3);

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [
      {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 3, type: 'distance' },
        ],
      },
    ],
  ]);
});

test('Should emit input event when target set name is updated', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 2, type: 'distance' },
        ],
      },
    },
  });

  // Update distance value
  await wrapper.find('input').setValue('My target set #2');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [
      {
        name: 'My target set #2',
        targets: [
          { distanceUnit: 'miles', distanceValue: 2, type: 'distance' },
        ],
      },
    ],
  ]);
});

test('removeTarget button should correctly remove target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 1, type: 'distance' },
          { distanceUnit: 'miles', distanceValue: 2, type: 'distance' },
          { distanceUnit: 'miles', distanceValue: 3, type: 'distance' },
        ],
      },
    },
  });

  // Remove 2nd target
  await wrapper.findAll('button[title="Remove target"]')[1].trigger('click');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      name: 'My target set',
      targets: [
        { distanceUnit: 'miles', distanceValue: 1, type: 'distance' },
        { distanceUnit: 'miles', distanceValue: 3, type: 'distance' },
      ],
    }],
  ]);
});
