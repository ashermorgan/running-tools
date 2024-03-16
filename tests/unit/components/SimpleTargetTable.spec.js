import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';

test('results should be correct and sorted by time', () => {
  // Initialize component
  const wrapper = shallowMount(SimpleTargetTable, {
    propsData: {
      calculateResult: (row) => ({
        distanceValue: row.distanceValue ? row.distanceValue : row.time / 300,
        distanceUnit: row.distanceUnit ? row.distanceUnit : 'miles',
        time: row.time ? row.time : row.distanceValue * 300,
        result: row.result,
      }),
      targets: [
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
        { result: 'distance', time: 1230 },
      ],
    },
  });

  // Assert results are correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 mi');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('5:00.00');
  expect(rows[0].findAll('td').length).to.equal(2);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('3 mi');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('15:00.00');
  expect(rows[1].findAll('td').length).to.equal(2);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('4.10 mi');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('20:30');
  expect(rows[2].findAll('td').length).to.equal(2);
  expect(rows[3].findAll('td')[0].element.textContent).to.equal('5 km');
  expect(rows[3].findAll('td')[1].element.textContent).to.equal('25:00.00');
  expect(rows[3].findAll('td').length).to.equal(2);
  expect(rows.length).to.equal(4);
});

test('should show correct imperial paces when showPace is true', () => {
  // Initialize component
  const wrapper = shallowMount(SimpleTargetTable, {
    propsData: {
      calculateResult: (row) => ({
        distanceValue: row.distanceValue ? row.distanceValue : row.time / 300,
        distanceUnit: row.distanceUnit ? row.distanceUnit : 'miles',
        time: row.time ? row.time : row.distanceValue * 300,
        result: row.result,
      }),
      targets: [
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
        { result: 'distance', time: 1230 },
      ],
      defaultUnitSystem: 'imperial',
      showPace: true,
    },
  });

  // Assert results are correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 mi');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('5:00.00');
  expect(rows[0].findAll('td')[2].element.textContent).to.equal('5:00 / mi');
  expect(rows[0].findAll('td').length).to.equal(3);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('3 mi');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('15:00.00');
  expect(rows[1].findAll('td')[2].element.textContent).to.equal('5:00 / mi');
  expect(rows[1].findAll('td').length).to.equal(3);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('4.10 mi');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('20:30');
  expect(rows[2].findAll('td')[2].element.textContent).to.equal('5:00 / mi');
  expect(rows[2].findAll('td').length).to.equal(3);
  expect(rows[3].findAll('td')[0].element.textContent).to.equal('5 km');
  expect(rows[3].findAll('td')[1].element.textContent).to.equal('25:00.00');
  expect(rows[3].findAll('td')[2].element.textContent).to.equal('8:03 / mi');
  expect(rows[3].findAll('td').length).to.equal(3);
  expect(rows.length).to.equal(4);
});

test('should show correct metric paces when showPace is true', () => {
  // Initialize component
  const wrapper = shallowMount(SimpleTargetTable, {
    propsData: {
      calculateResult: (row) => ({
        distanceValue: row.distanceValue ? row.distanceValue : row.time / 300,
        distanceUnit: row.distanceUnit ? row.distanceUnit : 'miles',
        time: row.time ? row.time : row.distanceValue * 300,
        result: row.result,
      }),
      targets: [
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
        { result: 'distance', time: 1230 },
      ],
      defaultUnitSystem: 'metric',
      showPace: true,
    },
  });

  // Assert results are correctly rendered
  const rows = wrapper.findAll('tbody tr');
  expect(rows[0].findAll('td')[0].element.textContent).to.equal('1 mi');
  expect(rows[0].findAll('td')[1].element.textContent).to.equal('5:00.00');
  expect(rows[0].findAll('td')[2].element.textContent).to.equal('3:06 / km');
  expect(rows[0].findAll('td').length).to.equal(3);
  expect(rows[1].findAll('td')[0].element.textContent).to.equal('3 mi');
  expect(rows[1].findAll('td')[1].element.textContent).to.equal('15:00.00');
  expect(rows[1].findAll('td')[2].element.textContent).to.equal('3:06 / km');
  expect(rows[1].findAll('td').length).to.equal(3);
  expect(rows[2].findAll('td')[0].element.textContent).to.equal('4.10 mi');
  expect(rows[2].findAll('td')[1].element.textContent).to.equal('20:30');
  expect(rows[2].findAll('td')[2].element.textContent).to.equal('3:06 / km');
  expect(rows[2].findAll('td').length).to.equal(3);
  expect(rows[3].findAll('td')[0].element.textContent).to.equal('5 km');
  expect(rows[3].findAll('td')[1].element.textContent).to.equal('25:00.00');
  expect(rows[3].findAll('td')[2].element.textContent).to.equal('5:00 / km');
  expect(rows[3].findAll('td').length).to.equal(3);
  expect(rows.length).to.equal(4);
});
