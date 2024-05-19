import { beforeEach, test, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

beforeEach(() => {
  localStorage.clear();
})

test('should correctly render target sets options', async () => {
  // Initialize localStorage
  const targetSets = {
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
  localStorage.setItem('running-tools.target-sets', JSON.stringify(targetSets));

  // Initialize component
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      modelValue: 'B',
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
  // Initialize localStorage
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
  localStorage.setItem('running-tools.target-sets', JSON.stringify(targetSets));

  // Initialize component
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      modelValue: 'A',
    }
  });

  // Add target set
  await wrapper.find('select').setValue('_new');

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
  expect(localStorage.getItem('running-tools.target-sets')).to.equal(JSON.stringify(targetSets));

  // Assert targets-updated event was emitted
  expect(wrapper.emitted()['targets-updated'].length).to.equal(1);
});

test('Revert event should correctly reset a default target set', async () => {
  // Initialize localStorage
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
  localStorage.setItem('running-tools.target-sets', JSON.stringify(targetSets));

  // Initialize component
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      modelValue: '_split_targets',
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
  expect(localStorage.getItem('running-tools.target-sets')).to.equal(JSON.stringify(targetSets));

  // Assert targets-updated event was emitted
  expect(wrapper.emitted()['targets-updated'].length).to.equal(1);
});

test('Revert event should correctly delete a custom target set', async () => {
  // Initialize localStorage
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
  localStorage.setItem('running-tools.target-sets', JSON.stringify(targetSets));

  // Initialize component
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      modelValue: '1234567890123',
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
  expect(localStorage.getItem('running-tools.target-sets')).to.equal(JSON.stringify(targetSets));

  // Assert targets-updated event was emitted
  expect(wrapper.emitted()['targets-updated'].length).to.equal(1);
});

test('edit button should open target editor with the correct props for default set', async () => {
  // Initialize localStorage
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
  localStorage.setItem('running-tools.target-sets', JSON.stringify(targetSets));

  // Initialize component
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      modelValue: '_split_targets',
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
  // Initialize localStorage
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
  localStorage.setItem('running-tools.target-sets', JSON.stringify(targetSets));

  // Initialize component
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      modelValue: '1234567890123',
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

test('should reload and sort target set before target editor is opened', async () => {
  // Initialize localStorage
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
  localStorage.setItem('running-tools.target-sets', JSON.stringify(targetSets));

  // Initialize component
  const wrapper = shallowMount(TargetSetSelector, {
    propsData: {
      modelValue: '_split_targets',
    }
  });

  // Update localStorage
  targetSets._split_targets.name = '5K Mile Splits #2';
  localStorage.setItem('running-tools.target-sets', JSON.stringify(targetSets));

  // Mock showModal function
  wrapper.vm.dialogElement.showModal = vi.fn();

  // Click edit button
  await wrapper.find('button').trigger('click');

  // Assert target set was sorted
  expect(wrapper.findComponent({ name: 'target-editor' }).vm.modelValue).to.deep.equal({
    name: '5K Mile Splits #2',
    targets: [
      { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
      { result: 'distance', timeValue: 60 },
    ],
  });
});
