import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import DoubleOutputTable from '@/components/DoubleOutputTable.vue';

test('should correctly render table body rows and headers', () => {
  // Initialize component
  const results = [
    { key: 'key1', value: 'value1', pace: 'pace1', result: 'value', sort: 2 },
    { key: 'key2', value: 'value2', pace: 'pace2', result: 'value', sort: 1 },
    { key: 'key3', value: 'value3', pace: 'pace3', result: 'value', sort: 3 },

    { key: 'key4', value: 'value4', pace: 'pace4', result: 'key', sort: 2 },
    { key: 'key5', value: 'value5', pace: 'pace5', result: 'key', sort: 1 },
    { key: 'key6', value: 'value6', pace: 'pace6', result: 'key', sort: 3 },

    { key: 'key7', value: 'value7', pace: 'pace7', result: 'value', sort: 2 },
    { key: 'key8', value: 'value8', pace: 'pace8', result: 'value', sort: 1 },
    { key: 'key9', value: 'value9', pace: 'pace9', result: 'value', sort: 3 },
  ];
  const wrapper = shallowMount(DoubleOutputTable, {
    propsData: {
      calculateResult: (col, row) => {
        expect(col.distanceUnit).to.equal('miles');
        expect(col.distanceValue).to.equal(2);
        return results[row.id + 3*(col.time - 600)];
      },
      targets: [
        { id: 0 },
        { id: 1 },
        { id: 2 },
      ],
      inputTimes: [ 600, 601, 602 ],
      inputDistance: {
        distanceUnit: 'miles',
        distanceValue: 2,
      },
    },
  });

  // Assert headers are correctly generated from first row of results
  const headers = wrapper.findAll('th');
  expect(headers[0].element.textContent).to.equal('2 mi');
  expect(headers[1].element.textContent).to.equal('key1');
  expect(headers[2].element.textContent).to.equal('key2');
  expect(headers[3].element.textContent).to.equal('key3');
  expect(headers.length).to.equal(4);

  // Assert results are correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('10:00');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('value1');
  expect(rows[0].findAll('td')[2].element.textContent).to.equal('value2');
  expect(rows[0].findAll('td')[3].element.textContent).to.equal('value3');
  expect(rows[0].findAll('td').length).to.equal(4);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('10:01');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('key4');
  expect(rows[1].findAll('td')[2].element.textContent).to.equal('key5');
  expect(rows[1].findAll('td')[3].element.textContent).to.equal('key6');
  expect(rows[1].findAll('td').length).to.equal(4);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('10:02');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('value7');
  expect(rows[2].findAll('td')[2].element.textContent).to.equal('value8');
  expect(rows[2].findAll('td')[3].element.textContent).to.equal('value9');
  expect(rows[2].findAll('td').length).to.equal(4);
  expect(rows.length).to.equal(3);
});

test('Should display message when inputs are empty', () => {
  // Initialize component
  const wrapper = shallowMount(DoubleOutputTable, {
    propsData: {
      calculateResult: () => ({ key: 'a', value: 'b', result: 'value', sort: 0 }),
      targets: [
        { id: 0 },
        { id: 1 },
        { id: 2 },
      ],
      inputTimes: [],
      inputDistance: {
        distanceUnit: 'miles',
        distanceValue: 2,
      },
    },
  });

  // Assert headers are correctly generated
  const headers = wrapper.findAll('th');
  expect(headers[0].element.textContent).to.equal('2 mi');
  expect(headers.length).to.equal(1);

  // Assert results are correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].text()).to.equal('No inputs were specified.');
  expect(rows[0].findAll('td').length).to.equal(1);
  expect(rows.length).to.equal(1);
});
