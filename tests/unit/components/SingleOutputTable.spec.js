import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SingleOutputTable from '@/components/SingleOutputTable.vue';

test('results should be correct and sorted by sort key', () => {
  // Initialize component
  const results = [
    { key: 'key1', value: 'value1', pace: 'pace1', result: 'key', sort: 2 },
    { key: 'key2', value: 'value2', pace: 'pace2', result: 'key', sort: 1 },
    { key: 'key3', value: 'value3', pace: 'pace3', result: 'key', sort: 3 },
  ];
  const wrapper = shallowMount(SingleOutputTable, {
    propsData: {
      calculateResult: (row) => results[row.id],
      targets: [
        { id: 0 },
        { id: 1 },
        { id: 2 },
      ],
    },
  });

  // Assert results are correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('key2');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('value2');
  expect(rows[0].findAll('td').length).to.equal(2);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('key1');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('value1');
  expect(rows[1].findAll('td').length).to.equal(2);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('key3');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('value3');
  expect(rows[2].findAll('td').length).to.equal(2);
  expect(rows.length).to.equal(3);
});

test('results should have correct classes', () => {
  // Initialize component
  const results = [
    { key: 'key1', value: 'value1', pace: 'pace1', result: 'value', sort: 1 },
    { key: 'key2', value: 'value2', pace: 'pace2', result: 'key', sort: 2 },
    { key: 'key3', value: 'value3', pace: 'pace3', result: 'value', sort: 3 },
  ];
  const wrapper = shallowMount(SingleOutputTable, {
    propsData: {
      calculateResult: (row) => results[row.id],
      targets: [
        { id: 0 },
        { id: 1 },
        { id: 2 },
      ],
    },
  });

  // Assert results are correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.classList).toHaveLength(0);
  expect(rows[0].findAll('td')[1].element.classList).to.contain(['result']);
  expect(rows[0].findAll('td').length).to.equal(2);
  expect(rows[1].findAll('td')[0].element.classList).to.contain(['result']);
  expect(rows[1].findAll('td')[1].element.classList).toHaveLength(0);
  expect(rows[1].findAll('td').length).to.equal(2);
  expect(rows[2].findAll('td')[0].element.classList).toHaveLength(0);
  expect(rows[2].findAll('td')[1].element.classList).contain(['result']);
  expect(rows[2].findAll('td').length).to.equal(2);
  expect(rows.length).to.equal(3);
});

test('should show correct paces when showPace is true', () => {
  // Initialize component
  const results = [
    { key: 'key1', value: 'value1', pace: 'pace1', result: 'key', sort: 1 },
    { key: 'key2', value: 'value2', pace: 'pace2', result: 'key', sort: 2 },
    { key: 'key3', value: 'value3', pace: 'pace3', result: 'key', sort: 3 },
  ];
  const wrapper = shallowMount(SingleOutputTable, {
    propsData: {
      calculateResult: (row) => results[row.id],
      targets: [
        { id: 0 },
        { id: 1 },
        { id: 2 },
      ],
      showPace: true,
    },
  });

  // Assert results are correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('key1');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('value1');
  expect(rows[0].findAll('td')[2].element.textContent).to.equal('pace1');
  expect(rows[0].findAll('td').length).to.equal(3);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('key2');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('value2');
  expect(rows[1].findAll('td')[2].element.textContent).to.equal('pace2');
  expect(rows[1].findAll('td').length).to.equal(3);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('key3');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('value3');
  expect(rows[2].findAll('td')[2].element.textContent).to.equal('pace3');
  expect(rows[2].findAll('td').length).to.equal(3);
  expect(rows.length).to.equal(3);
});
