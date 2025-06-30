import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SplitOutputTable from '@/components/SplitOutputTable.vue';

test('should initialize undefined splits to 0:00.00', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitOutputTable, {
    propsData: {
      modelValue: [
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  });

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 mi');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 mi');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('5 km');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('0:00.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue).to.equal(0);
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should correctly load split times from split targets', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitOutputTable, {
    propsData: {
      modelValue: [
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers', splitTime: 180 },
        { result: 'time', distanceValue: 2, distanceUnit: 'kilometers', splitTime: 190 },
        { result: 'time', distanceValue: 3000, distanceUnit: 'meters', splitTime: 200 },
      ],
    },
  });

  // Assert results are correct
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 km');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('3:00.00');
  expect(rows[0].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue)
    .to.equal(180);
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 km');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('6:10.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue)
    .to.equal(190);
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('3000 m');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('9:30.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' }).vm.modelValue)
    .to.equal(200);
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should correctly calculate paces and cumulative times from entered split times', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitOutputTable, {
    propsData: {
      modelValue: [
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
      ],
    },
  });

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
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('4:21 / km');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('2 mi');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('13:30.00');
  expect(rows[1].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(390);
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('4:02 / km');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('5 km');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('20:00.00');
  expect(rows[2].findAll('td')[2].findComponent({ name: 'time-input' })
    .vm.modelValue).to.equal(390);
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('3:39 / km');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('should emit update event when split times are changed', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitOutputTable, {
    propsData: {
      modelValue: [
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers', splitTime: 180 },
        { result: 'time', distanceValue: 2, distanceUnit: 'kilometers', splitTime: 180 },
        { result: 'time', distanceValue: 3000, distanceUnit: 'meters', splitTime: 180 },
      ],
    },
  });

  // Update split times
  await wrapper.findAllComponents({ name: 'time-input' })[1].setValue(190);
  await wrapper.findAllComponents({ name: 'time-input' })[2].setValue(200);

  // Assert update events correctly emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [[
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers', splitTime: 180 },
        { result: 'time', distanceValue: 2, distanceUnit: 'kilometers', splitTime: 190 },
        { result: 'time', distanceValue: 3000, distanceUnit: 'meters', splitTime: 180 },
    ]],
    [[
        { result: 'time', distanceValue: 1, distanceUnit: 'kilometers', splitTime: 180 },
        { result: 'time', distanceValue: 2, distanceUnit: 'kilometers', splitTime: 190 },
        { result: 'time', distanceValue: 3000, distanceUnit: 'meters', splitTime: 200 },
    ]],
  ]);
});

test('should update paces according to default units setting', async () => {
  // Initialize component
  const wrapper = shallowMount(SplitOutputTable, {
    propsData: {
      modelValue: [
        { result: 'time', distanceValue: 1, distanceUnit: 'miles', splitTime: 300 },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles', splitTime: 300 },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers', splitTime: 330 },
      ],
      defaultUnitSystem: 'metric',
    }
  });

  // Assert paces are correct
  let rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('3:06 / km');
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('3:06 / km');
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('3:05 / km');

  // Change default units
  await wrapper.setProps({ defaultUnitSystem: 'imperial' });

  // Assert paces are correct
  rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('5:00 / mi');
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('5:00 / mi');
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('4:58 / mi');
});
