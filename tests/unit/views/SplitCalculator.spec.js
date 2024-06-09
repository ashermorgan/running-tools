import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SplitCalculator from '@/views/SplitCalculator.vue';

beforeEach(() => {
  localStorage.clear();
})

test('should initialize undefined splits to 0:00.00', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 mi');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 mi');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('5 km');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should correctly load split times from split targets', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
      ],
    },
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 km');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('3:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue)
    .to.equal(180);
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('4:50 / mi');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 km');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('6:10.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue)
    .to.equal(190);
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('5:06 / mi');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('3000 m');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('9:30.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue)
    .to.equal(200);
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('5:22 / mi');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should correctly handle null target set', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-target-set', '"does_not_exist"');

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert results are empty
  let rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent.trim())
    .to.equal('There aren\'t any targets in this set yet.');
  expect(rows[0].findAll('td').length).to.equal(1);
  expect(rows.length).to.equal(1);

  // Switch to valid target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('_split_targets', 'selectedTargetSet');

  // Assert results are correct
  rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 mi');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows.length).to.equal(3);
});

test('should correctly calculate paces and cumulative times from entered split times', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Update split times
  await wrapper.findAllComponents({ name: 'time-input' })[0].setValue(420);
  await wrapper.findAllComponents({ name: 'time-input' })[1].setValue(390);
  await wrapper.findAllComponents({ name: 'time-input' })[2].setValue(390);

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 mi');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('7:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(420);
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('7:00 / mi');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 mi');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('13:30.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(390);
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('6:30 / mi');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('5 km');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('20:00.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(390);
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('5:52 / mi');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should correctly sort split targets', async () => {
  // Initialize localStorage (targets are mis-ordered)
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers' },
      ],
    },
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator)

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 km');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 km');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('2 mi');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should ignore time based targets', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'time', time: 600 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters' },
      ],
    },
  }));
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 km');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 km');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('3000 m');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('0:00 / mi');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should correctly save split times with split targets in localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 180 },
      ],
    },
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Update split times
  await wrapper.findAllComponents({ name: 'time-input' })[1].setValue(190);
  await wrapper.findAllComponents({ name: 'time-input' })[2].setValue(200);

  // Assert targets correctly saved in localStorage
  expect(localStorage.getItem('running-tools.split-calculator-target-sets')).to.equal(JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
      ],
    },
  }));
});

test('should update results when a new target set is selected', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
    'B': {
      name: 'Split targets #2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
      ],
    },
  }));

  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert default split targets are initially loaded
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet)
    .to.equal('_split_targets');
  expect(wrapper.findAll('tbody td')[0].element.textContent).to.equal('1 mi');

  // Select a new target set
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue('B', 'selectedTargetSet');

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 km');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('3:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(180);
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('4:50 / mi');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 km');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('6:10.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(190);
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('5:06 / mi');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('3000 m');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('9:30.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(200);
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('5:22 / mi');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should load selected target set from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.split-calculator-target-set', '"B"');
  localStorage.setItem('running-tools.split-calculator-target-sets', JSON.stringify({
    '_split_targets': {
      name: 'Split targets',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
    'B': {
      name: 'Split targets #2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers', split: 180 },
        { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers', split: 190 },
        { type: 'distance', distanceValue: 3000, distanceUnit: 'meters', split: 200 },
      ],
    },
  }));


  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to.equal('B');

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 km');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('3:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(180);
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('4:50 / mi');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 km');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('6:10.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(190);
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('5:06 / mi');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('3000 m');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('9:30.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(200);
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('5:22 / mi');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should save selected target set to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Select a new target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('_race_targets', 'selectedTargetSet');

  // New selected target set should be saved to localStorage
  expect(localStorage.getItem('running-tools.split-calculator-target-set'))
    .to.equal('"_race_targets"');
});

test('should update paces according to default units setting', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Enter split times
  await wrapper.findAllComponents({ name: 'time-input' })[0].setValue(300);
  await wrapper.findAllComponents({ name: 'time-input' })[1].setValue(300);
  await wrapper.findAllComponents({ name: 'time-input' })[2].setValue(330);

  // Set default units setting
  await wrapper.find('select', { name: 'Default units' }).setValue('metric');

  // Assert paces are correct
  let rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('3:06 / km');
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('3:06 / km');
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('3:05 / km');

  // Change default units
  await wrapper.find('select').setValue('imperial');

  // Assert paces are correct
  rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('5:00 / mi');
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('5:00 / mi');
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('4:58 / mi');
});

test('should save default units setting to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitCalculator);

  // Change default units
  await wrapper.find('select').setValue('imperial');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"imperial"');
});
