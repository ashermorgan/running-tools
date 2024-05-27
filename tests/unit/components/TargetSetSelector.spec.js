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
            { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
            { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
            { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
          ],
        },
        'B': {
          name: '2nd target set',
          targets: [
            { result: 'time', distanceValue: 1, distanceUnit: 'kilometers' },
            { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
            { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },
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
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    'B': {
      name: '2nd target set',
      targets: [
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  };
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: 'A',
      targetSets,
    }
  });

  // Add target set
  await wrapper.find('select').setValue('_new');

  // Assert new target set selected (key is unix timestamp in milliseconds)
  const key = wrapper.find('select').element.value
  expect(parseInt(key)).to.be.closeTo(parseInt(Date.now().toString()), 1000);

  // Assert target set options were correctly updated
  const options = wrapper.findAll('option');
  expect(options[0].element.text).to.equal('1st target set');
  expect(options[0].element.value).to.equal('A');
  expect(options[1].element.text).to.equal('2nd target set');
  expect(options[1].element.value).to.equal('B');
  expect(options[2].element.text).to.equal('New target set');
  expect(options[2].element.value).to.match(/\d{12,14}/);
  expect(options[3].element.text).to.equal('[ Create New Target Set ]');
  expect(options[3].element.value).to.equal('_new');
  expect(options.length).to.equal(4);

  // Assert target sets were correctly updated
  targetSets[options[2].element.value] = {
    name: 'New target set',
    targets: [],
  };
  expect(wrapper.vm.targetSets).to.deep.equal(targetSets);
});

test('Revert event should correctly reset a default target set', async () => {
  // Initialize component
  let targetSets = {
    '_split_targets': {
      name: '1st target set',
      targets: [
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    '1234567890123': {
      name: '2nd target set',
      targets: [
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },
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

  // Assert target sets were correctly updated
  targetSets._split_targets.name = '5K Mile Splits';
  targetSets._split_targets.targets[2] = {
    result: 'time',
    distanceValue: 5,
    distanceUnit: 'kilometers',
  };
  expect(wrapper.vm.targetSets).to.deep.equal(targetSets);
});

test('Revert event should correctly delete a custom target set', async () => {
  // Initialize component
  let targetSets = {
    '_split_targets': {
      name: '1st target set',
      targets: [
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    '1234567890123': {
      name: '2nd target set',
      targets: [
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },
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

  // Assert target sets were correctly updated
  delete targetSets['1234567890123'];
  expect(wrapper.vm.targetSets).to.deep.equal(targetSets);
});

test('edit button should open target editor with the correct props for default set', async () => {
  // Initialize component
  const targetSets = {
    '_split_targets': {
      name: '5K Mile Splits',
      targets: [
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
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
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },
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

test('should sort target set before target editor is opened', async () => {
  // Initialize component
  let targetSets = {
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
  };
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      selectedTargetSet: '_split_targets',
      targetSets,
    }
  });

  // Mock showModal function
  wrapper.vm.dialogElement.showModal = vi.fn();

  // Click edit button
  await wrapper.find('button').trigger('click');

  // Assert target set was sorted
  expect(wrapper.findComponent({ name: 'target-editor' }).vm.modelValue).to.deep.equal({
    name: '5K Mile Splits',
    targets: [
      { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
      { result: 'distance', timeValue: 60 },
    ],
  });
});
