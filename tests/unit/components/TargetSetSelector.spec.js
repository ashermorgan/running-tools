import { test, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

test('should correctly render target sets options', async () => {
  // Initialize component
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: 'B',
      targetSets: {
        'A': {
          name: '1st target set',
          targets: [
            { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
            { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
            { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
          ],
        },
        'B': {
          name: '2nd target set',
          targets: [
            { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
            { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
            { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
          ],
        },
      },
    }
  });

  // Assert select element populated with target sets
  const options = wrapper.findAll('option');
  expect(options[0].element.text).to.equal('1st target set');
  expect(options[0].element.value).to.equal('A');
  expect(options[1].element.text).to.equal('2nd target set');
  expect(options[1].element.value).to.equal('B');
  expect(options[2].element.text).to.equal('[ Create New Target Set ]');
  expect(options[2].element.value).to.equal('_new');
  expect(options.length).to.equal(3);

  // Assert correct target set is selected
  expect(wrapper.find('select').element.value).to.equal('B');
});

test('Create New Target Set option should correctly add target set', async () => {
  // Initialize component
  let targetSets = {
    'A': {
      name: '1st target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    'B': {
      name: '2nd target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  };
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '_new',
      targetSets,
    }
  });
  await wrapper.vm.$nextTick();

  // Assert new target set selected (key is unix timestamp in milliseconds)
  const key1 = wrapper.find('select').element.value;
  expect(parseInt(key1)).to.be.closeTo(parseInt(Date.now().toString()), 1000);

  // Assert target set options were correctly updated
  let options = wrapper.findAll('option');
  expect(options[0].element.text).to.equal('1st target set');
  expect(options[0].element.value).to.equal('A');
  expect(options[1].element.text).to.equal('2nd target set');
  expect(options[1].element.value).to.equal('B');
  expect(options[2].element.text).to.equal('New target set');
  expect(options[2].element.value).to.equal(key1)
  expect(options[3].element.text).to.equal('[ Create New Target Set ]');
  expect(options[3].element.value).to.equal('_new');
  expect(options.length).to.equal(4);

  // Assert update event emitted with correct target sets
  expect(wrapper.emitted()['update:targetSets']).to.deep.equal([
    [{
      [key1]: {
        name: 'New target set',
        targets: [],
      },
      ...targetSets,
    }],
  ]);

  // Add another target set
  await wrapper.find('select').setValue('_new');

  // Assert new target set selected (key is unix timestamp in milliseconds)
  const key2 = wrapper.find('select').element.value;
  expect(parseInt(key2)).to.be.closeTo(parseInt(Date.now().toString()), 1000);
  expect(key2).to.not.equal(key1);

  // Assert target set options were correctly updated
  options = wrapper.findAll('option');
  expect(options[0].element.text).to.equal('1st target set');
  expect(options[0].element.value).to.equal('A');
  expect(options[1].element.text).to.equal('2nd target set');
  expect(options[1].element.value).to.equal('B');
  expect(options[2].element.text).to.equal('New target set');
  expect(options[2].element.value).to.equal(key1)
  expect(options[3].element.text).to.equal('New target set');
  expect(options[3].element.value).to.equal(key2);
  expect(options[4].element.text).to.equal('[ Create New Target Set ]');
  expect(options[4].element.value).to.equal('_new');
  expect(options.length).to.equal(5);

  // Assert update event emitted with correct target sets
  expect(wrapper.emitted()['update:targetSets']).to.deep.equal([
    [{
      [key1]: {
        name: 'New target set',
        targets: [],
      },
      ...targetSets,
    }],
    [{
      [key1]: {
        name: 'New target set',
        targets: [],
      },
      ...targetSets,
      [key2]: {
        name: 'New target set',
        targets: [],
      },
    }],
  ]);
});

test('Revert event should correctly reset a default target set', async () => {
  // Initialize component
  let targetSets = {
    '_split_targets': {
      name: '1st target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    '1234567890123': {
      name: '2nd target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  };
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '_split_targets',
      targetSets,
    }
  });

  // Add target set
  await wrapper.findComponent({ name: 'target-editor' }).trigger('revert');

  // Assert target set options were correctly updated
  const options = wrapper.findAll('option');
  expect(options[0].element.text).to.equal('5K Mile Splits');
  expect(options[0].element.value).to.equal('_split_targets');
  expect(options[1].element.text).to.equal('2nd target set');
  expect(options[1].element.value).to.equal('1234567890123');
  expect(options[2].element.text).to.equal('[ Create New Target Set ]');
  expect(options[2].element.value).to.equal('_new');
  expect(options.length).to.equal(3);

  // Assert update event emitted with correct target sets
  expect(wrapper.emitted()['update:targetSets']).to.deep.equal([
    [{
      '_split_targets': {
        name: '5K Mile Splits',
        targets: [
          { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        ],
      },
      '1234567890123': {
        name: '2nd target set',
        targets: [
          { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
          { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
          { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
        ],
      },
    }],
  ]);
});

test('Revert event should correctly delete a custom target set', async () => {
  // Initialize component
  let targetSets = {
    '_split_targets': {
      name: '1st target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    '1234567890123': {
      name: '2nd target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  };
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '1234567890123',
      targetSets,
    }
  });

  // Add target set
  await wrapper.findComponent({ name: 'target-editor' }).trigger('revert');

  // Assert target set options were correctly updated
  const options = wrapper.findAll('option');
  expect(options[0].element.text).to.equal('1st target set');
  expect(options[0].element.value).to.equal('_split_targets');
  expect(options[1].element.text).to.equal('[ Create New Target Set ]');
  expect(options[1].element.value).to.equal('_new');
  expect(options.length).to.equal(2);

  // Assert update event emitted with correct target sets
  expect(wrapper.emitted()['update:targetSets']).to.deep.equal([
    [{
      '_split_targets': {
        name: '1st target set',
        targets: [
          { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
        ],
      },
    }],
  ]);
});

test('edit button should open target editor with the correct props for default set', async () => {
  // Initialize component
  const targetSets = {
    '_split_targets': {
      name: '5K Mile Splits',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  };
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '_split_targets',
      targetSets,
      defaultUnitSystem: 'fake-unit-system',
    }
  });

  // Mock showModal function
  wrapper.vm.dialogElement.showModal = vi.fn();

  // Click edit button
  await wrapper.find('button').trigger('click');

  // Assert target editor props are correct
  const targetEditor = wrapper.findComponent({ name: 'target-editor' });
  expect(targetEditor.vm.modelValue).to.deep.equal(targetSets._split_targets);
  expect(targetEditor.vm.isCustomSet).to.equal(false);
  expect(targetEditor.vm.defaultUnitSystem).to.equal('fake-unit-system');
});

test('edit button should open target editor with the correct props for custom set', async () => {
  // Initialize component
  const targetSets = {
    '1234567890123': {
      name: '2nd target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  };
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '1234567890123',
      targetSets,
      defaultUnitSystem: 'fake-unit-system',
    }
  });

  // Mock showModal function
  wrapper.vm.dialogElement.showModal = vi.fn();

  // Click edit button
  await wrapper.find('button').trigger('click');

  // Assert target editor props are correct
  const targetEditor = wrapper.findComponent({ name: 'target-editor' });
  expect(targetEditor.vm.modelValue).to.deep.equal(targetSets['1234567890123']);
  expect(targetEditor.vm.isCustomSet).to.equal(true);
  expect(targetEditor.vm.defaultUnitSystem).to.equal('fake-unit-system');
});

test('should sort target set after target editor is closed', async () => {
  // Initialize component
  let targetSets = {
    '_split_targets': {
      name: '5K Mile Splits',
      targets: [],
    },
  };
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '_split_targets',
      targetSets,
    }
  });

  // Mock modal close function
  wrapper.vm.dialogElement.close = vi.fn();

  // Update targets and trigger close event
  await wrapper.findComponent({ name: 'target-editor' }).setValue({
    name: '5K Mile Splits',
    targets: [
      { type: 'time', timeValue: 60 },
      { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
    ],
  });
  await wrapper.findComponent({ name: 'target-editor' }).vm.$emit('close');

  // Assert update events were emitted correctly
  expect(wrapper.emitted()['update:targetSets']).to.deep.equal([
    [{
      _split_targets: {
        name: '5K Mile Splits',
        targets: [
          { type: 'time', timeValue: 60 },
          { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
          { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
        ],
      },
    }],
    [{
      _split_targets: {
        name: '5K Mile Splits',
        targets: [
          { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
          { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
          { type: 'time', timeValue: 60 },
        ],
      },
    }],
  ]);
});

test('should correctly pass setType prop to TargetEditor', async () => {
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '_new',
      targetSets: {},
      setType: 'foo'
    },
  });

  // Assert target editor props are correct
  expect(wrapper.findComponent({ name: 'target-editor' }).vm.setType).to.equal('foo');
});

test('should correctly pass customWorkoutNames prop to TargetEditor', async () => {
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '_new',
      targetSets: {},
      customWorkoutNames: false,
    }
  });

  // Assert target editor props are correct
  expect(wrapper.findComponent({ name: 'target-editor' }).vm.customWorkoutNames).to.equal(false);

  // Update customWorkoutNames prop
  await wrapper.setProps({ customWorkoutNames: true });

  // Assert target editor props are correct
  expect(wrapper.findComponent({ name: 'target-editor' }).vm.customWorkoutNames).to.equal(true);
});
