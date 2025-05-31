import { beforeEach, describe, test, expect } from 'vitest';
import * as storage from '@/utils/storage';

beforeEach(() => {
  localStorage.clear();
})

describe('get method', () => {
  test('should correctly parse correct localStorage item', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.foo', '{"bar":123}');

    // Assert result is correct
    expect(storage.get('foo')).to.deep.equal({ bar: 123 });
  });

  test('should return null for corrupt localStorage item', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.foo', 'invalid json');

    // Assert result is correct
    expect(storage.get('foo')).to.equal(null);
  });

  test('should return null for missing localStorage item', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.foo', '{"bar":123}');

    // Assert result is correct
    expect(storage.get('baz')).to.equal(null);
  });
});

describe('set method', () => {
  test('should correctly set new localStorage item', async () => {
    // Set localStorage item
    storage.set('foo', { baz: 456 });

    // Assert result is correct
    expect(localStorage.getItem('running-tools.foo')).to.equal('{"baz":456}');
  });

  test('should correctly override existing localStorage item', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.foo', '{"bar":123}');

    // Set localStorage item
    storage.set('foo', { baz: 456 });

    // Assert result is correct
    expect(localStorage.getItem('running-tools.foo')).to.equal('{"baz":456}');
  });
});

describe('migrate method', () => {
  test('should correctly migrate <=1.4.1 workout calculator options', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.workout-calculator-options',
      '{"model":"PurdyPointsModel","riegelExponent":1.1}');

    // Run migratinos
    storage.migrate();

    // Assert localStorage entries correctly migrated
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(
      '{"model":"PurdyPointsModel","riegelExponent":1.1,"customTargetNames":false}');
  });

  test('should not modify >1.4.1 workout calculator options', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.workout-calculator-options',
      '{"customTargetNames":true,"model":"PurdyPointsModel","riegelExponent":1.1}');

    // Run migratinos
    storage.migrate();

    // Assert localStorage entries not modified
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(
      '{"customTargetNames":true,"model":"PurdyPointsModel","riegelExponent":1.1}');
  });

  test('should not modify missing workout calculator options', async () => {
    // Run migratinos
    storage.migrate();

    // Assert localStorage entries not modified
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(null);
  });
});
