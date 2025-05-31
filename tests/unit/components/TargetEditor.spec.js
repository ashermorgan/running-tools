import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TargetEditor from '@/components/TargetEditor.vue';

test('should correctly render standard target set', async () => {
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
      setType: 'standard',
      customWorkoutNames: true, // name input should not be rendered
    },
  });

  // Assert target set correctly rendered
  expect(wrapper.find('input').element.value).to.equal('My target set');
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('input').length).to.equal(0);
  expect(rows[0].findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1.61);
  expect(rows[0].find('select').element.value).to.equal('kilometers');
  expect(rows[1].findAll('input').length).to.equal(0);
  expect(rows[1].findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(3.11);
  expect(rows[1].find('select').element.value).to.equal('miles');
  expect(rows[2].findAll('input').length).to.equal(0);
  expect(rows[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(600);
  expect(rows.length).to.equal(3);
});

test('should correctly render split target set', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'kilometers', distanceValue: 1.61, type: 'distance' },
          { distanceUnit: 'miles', distanceValue: 3.11, type: 'distance' },
        ],
      },
      setType: 'split',
    },
  });

  // Assert target set correctly rendered
  expect(wrapper.find('input').element.value).to.equal('My target set');
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('input').length).to.equal(0);
  expect(rows[0].findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1.61);
  expect(rows[0].find('select').element.value).to.equal('kilometers');
  expect(rows[1].findAll('input').length).to.equal(0);
  expect(rows[1].findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(3.11);
  expect(rows[1].find('select').element.value).to.equal('miles');
  expect(rows.length).to.equal(2);
});

test('should correctly render workout target set without custom names', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          {
            distanceUnit: 'miles', distanceValue: 2,
            splitUnit: 'meters', splitValue: 400,
            type: 'distance',
          },
          {
            time: 6000,
            splitUnit: 'kilometers', splitValue: 2,
            type: 'time',
          },
          {
            distanceUnit: 'kilometers', distanceValue: 5,
            splitUnit: 'miles', splitValue: 1,
            type: 'distance'
          },
        ],
      },
      setType: 'workout',
    },
  });

  // Assert target set correctly rendered
  expect(wrapper.find('input').element.value).to.equal('My target set');
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('input').length).to.equal(0);
  expect(rows[0].findAllComponents({ name: 'decimal-input' })[0].vm.modelValue).to.equal(400);
  expect(rows[0].findAll('select')[0].element.value).to.equal('meters');
  expect(rows[0].findAllComponents({ name: 'decimal-input' })[1].vm.modelValue).to.equal(2);
  expect(rows[0].findAll('select')[1].element.value).to.equal('miles');
  expect(rows[1].findAll('input').length).to.equal(0);
  expect(rows[1].findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(2);
  expect(rows[1].find('select').element.value).to.equal('kilometers');
  expect(rows[1].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(6000);
  expect(rows[2].findAll('input').length).to.equal(0);
  expect(rows[2].findAllComponents({ name: 'decimal-input' })[0].vm.modelValue).to.equal(1);
  expect(rows[2].findAll('select')[0].element.value).to.equal('miles');
  expect(rows[2].findAllComponents({ name: 'decimal-input' })[1].vm.modelValue).to.equal(5);
  expect(rows[2].findAll('select')[1].element.value).to.equal('kilometers');
  expect(rows.length).to.equal(3);
});

test('should correctly render workout target set with custom names', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          {
            // customName is undefined
            distanceUnit: 'miles', distanceValue: 2,
            splitUnit: 'meters', splitValue: 400,
            type: 'distance',
          },
          {
            customName: '',
            time: 6000,
            splitUnit: 'kilometers', splitValue: 2,
            type: 'time',
          },
          {
            customName: 'my custom name',
            distanceUnit: 'kilometers', distanceValue: 5,
            splitUnit: 'miles', splitValue: 1,
            type: 'distance'
          },
        ],
      },
      setType: 'workout',
      customWorkoutNames: true,
    },
  });

  // Assert target set correctly rendered
  expect(wrapper.find('input').element.value).to.equal('My target set');
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].find('input').element.value).to.equal('');
  expect(rows[0].find('input').element.placeholder).to.equal('400 m @ 2 mi');
  expect(rows[0].findAllComponents({ name: 'decimal-input' })[0].vm.modelValue).to.equal(400);
  expect(rows[0].findAll('select')[0].element.value).to.equal('meters');
  expect(rows[0].findAllComponents({ name: 'decimal-input' })[1].vm.modelValue).to.equal(2);
  expect(rows[0].findAll('select')[1].element.value).to.equal('miles');
  expect(rows[1].find('input').element.value).to.equal('');
  expect(rows[1].find('input').element.placeholder).to.equal('2 km @ 1:40:00');
  expect(rows[1].findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(2);
  expect(rows[1].find('select').element.value).to.equal('kilometers');
  expect(rows[1].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(6000);
  expect(rows[2].find('input').element.value).to.equal('my custom name');
  expect(rows[2].find('input').element.placeholder).to.equal('1 mi @ 5 km');
  expect(rows[2].findAllComponents({ name: 'decimal-input' })[0].vm.modelValue).to.equal(1);
  expect(rows[2].findAll('select')[0].element.value).to.equal('miles');
  expect(rows[2].findAllComponents({ name: 'decimal-input' })[1].vm.modelValue).to.equal(5);
  expect(rows[2].findAll('select')[1].element.value).to.equal('kilometers');
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

test('add distance target button should correctly add standard imperial distance target', async () => {
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
      setType: 'standard',
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

test('add distance target button should correctly add standard metric distance target', async () => {
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
      setType: 'standard',
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

test('add distance target button should correctly add split imperial distance target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 0, type: 'distance' },
        ],
      },
      setType: 'split',
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
        { distanceUnit: 'miles', distanceValue: 1, type: 'distance'},
      ],
    }],
  ]);
});

test('add distance target button should correctly add split metric distance target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          { distanceUnit: 'miles', distanceValue: 0, type: 'distance' },
        ],
      },
      setType: 'split',
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
        { distanceUnit: 'kilometers', distanceValue: 1, type: 'distance'},
      ],
    }],
  ]);
});

test('add distance target button should correctly add workout imperial distance target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          {
            distanceUnit: 'miles', distanceValue: 2,
            splitUnit: 'meters', splitValue: 400,
            type: 'distance',
          },
          {
            time: 6000,
            splitUnit: 'kilometers', splitValue: 2,
            type: 'time',
          },
        ],
      },
      setType: 'workout',
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
        {
          distanceUnit: 'miles', distanceValue: 2,
          splitUnit: 'meters', splitValue: 400,
          type: 'distance',
        },
        {
          time: 6000,
          splitUnit: 'kilometers', splitValue: 2,
          type: 'time',
        },
        {
          distanceUnit: 'miles', distanceValue: 1,
          splitUnit: 'miles', splitValue: 1,
          type: 'distance'
        },
      ],
    }],
  ]);
});

test('add distance target button should correctly add workout metric distance target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          {
            distanceUnit: 'miles', distanceValue: 2,
            splitUnit: 'meters', splitValue: 400,
            type: 'distance',
          },
          {
            time: 6000,
            splitUnit: 'kilometers', splitValue: 2,
            type: 'time',
          },
        ],
      },
      setType: 'workout',
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
        {
          distanceUnit: 'miles', distanceValue: 2,
          splitUnit: 'meters', splitValue: 400,
          type: 'distance',
        },
        {
          time: 6000,
          splitUnit: 'kilometers', splitValue: 2,
          type: 'time',
        },
        {
          distanceUnit: 'kilometers', distanceValue: 1,
          splitUnit: 'kilometers', splitValue: 1,
          type: 'distance'
        },
      ],
    }],
  ]);
});

test('add time target button should correctly add standard time target', async () => {
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
      setType: 'standard',
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

test('add time target button should correctly add workout imperial time target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          {
            distanceUnit: 'miles', distanceValue: 2,
            splitUnit: 'meters', splitValue: 400,
            type: 'distance',
          },
          {
            time: 6000,
            splitUnit: 'kilometers', splitValue: 2,
            type: 'time',
          },
        ],
      },
      setType: 'workout',
      defaultUnitSystem: 'imperial'
    },
  });

  // Add distance target
  await wrapper.find('button[title="Add time target"]').trigger('click');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      name: 'My target set',
      targets: [
        {
          distanceUnit: 'miles', distanceValue: 2,
          splitUnit: 'meters', splitValue: 400,
          type: 'distance',
        },
        {
          time: 6000,
          splitUnit: 'kilometers', splitValue: 2,
          type: 'time',
        },
        {
          time: 600,
          splitUnit: 'miles', splitValue: 1,
          type: 'time'
        },
      ],
    }],
  ]);
});

test('add time target button should correctly add workout metric time target', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [
          {
            distanceUnit: 'miles', distanceValue: 2,
            splitUnit: 'meters', splitValue: 400,
            type: 'distance',
          },
          {
            time: 6000,
            splitUnit: 'kilometers', splitValue: 2,
            type: 'time',
          },
        ],
      },
      setType: 'workout',
      defaultUnitSystem: 'metric'
    },
  });

  // Add distance target
  await wrapper.find('button[title="Add time target"]').trigger('click');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      name: 'My target set',
      targets: [
        {
          distanceUnit: 'miles', distanceValue: 2,
          splitUnit: 'meters', splitValue: 400,
          type: 'distance',
        },
        {
          time: 6000,
          splitUnit: 'kilometers', splitValue: 2,
          type: 'time',
        },
        {
          time: 600,
          splitUnit: 'kilometers', splitValue: 1,
          type: 'time'
        },
      ],
    }],
  ]);
});

test('should emit input event when targets are updated', async () => {
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

test('should emit input event when target set name is updated', async () => {
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

test('should display message when target set is empty', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetEditor, {
    propsData: {
      modelValue: {
        name: 'My target set',
        targets: [],
      },
    },
  });

  // Assert message correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].text()).to.equal('There aren\'t any targets in this set yet.');
  expect(rows.length).to.equal(1);
});
