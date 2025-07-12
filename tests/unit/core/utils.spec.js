import { beforeEach, describe, test, expect } from 'vitest';
import * as utils from '@/core/utils';

beforeEach(() => {
  localStorage.clear();
});

describe('deepCopy method', () => {
  test('should deeply clone an object', () => {
    let input = {
      foo: 123,
      bar: ['a', 'b', 'c'],
      baz: {
        baz: {
          baz: {
            baz: 'baz'
          }
        }
      }
    };
    let output = utils.deepCopy(input);

    // Output should equal input
    expect(output).to.deep.equal(input);

    // Modifying input should not modify output
    input.foo = 1234;
    input.baz.baz.baz.baz = 'baz2';
    expect(output).to.deep.equal({
      foo: 123,
      bar: ['a', 'b', 'c'],
      baz: {
        baz: {
          baz: {
            baz: 'baz'
          }
        }
      }
    });

    // Modifying output should not modify input
    output.foo = 12345;
    output.baz.baz.baz.baz = 'baz3';
    expect(input).to.deep.equal({
      foo: 1234,
      bar: ['a', 'b', 'c'],
      baz: {
        baz: {
          baz: {
            baz: 'baz2'
          }
        }
      }
    });
  });
});

describe('deepEqual method', () => {
  test('should correctly compare an object with itself', () => {
    let obj1 = {
      foo: 123,
      bar: ['a', 'b', 'c'],
      baz: {
        baz: {
          baz: {
            baz: 'baz'
          }
        }
      }
    };

    // obj1 should equal obj1
    expect(utils.deepEqual(obj1, obj1)).to.equal(true);
  });

  test('should correctly compare identical objects', () => {
    let obj1 = {
      foo: 123,
      bar: ['a', 'b', 'c'],
      baz: {
        baz: {
          baz: {
            baz: 'baz'
          }
        }
      }
    };
    let obj2 = {
      foo: 123,
      bar: ['a', 'b', 'c'],
      baz: {
        baz: {
          baz: {
            baz: 'baz'
          }
        }
      }
    };

    // obj1 should equal obj2
    expect(utils.deepEqual(obj1, obj2)).to.equal(true);
  });

  test('should correctly compare unequal objects', () => {
    let obj1 = {
      foo: 123,
      bar: ['a', 'b', 'c'],
      baz: {
        baz: {
          baz: {
            baz: 'baz'
          }
        }
      }
    };
    let obj2 = {
      foo: 123,
      bar: ['a', 'b', 'c'],
      baz: {
        baz: {
          baz: {
            baz: 'baz2'
          }
        }
      }
    };

    // obj1 should not equal obj2
    expect(utils.deepEqual(obj1, obj2)).to.equal(false);
  });
});

describe('get method', () => {
  test('should correctly parse correct localStorage item', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.foo', '{"bar":123}');

    // Assert result is correct
    expect(utils.getLocalStorage('foo')).to.deep.equal({ bar: 123 });
  });

  test('should return null for corrupt localStorage item', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.foo', 'invalid json');

    // Assert result is correct
    expect(utils.getLocalStorage('foo')).to.equal(null);
  });

  test('should return null for missing localStorage item', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.foo', '{"bar":123}');

    // Assert result is correct
    expect(utils.getLocalStorage('baz')).to.equal(null);
  });
});

describe('set method', () => {
  test('should correctly set new localStorage item', async () => {
    // Set localStorage item
    utils.setLocalStorage('foo', { baz: 456 });

    // Assert result is correct
    expect(localStorage.getItem('running-tools.foo')).to.equal('{"baz":456}');
  });

  test('should correctly override existing localStorage item', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.foo', '{"bar":123}');

    // Set localStorage item
    utils.setLocalStorage('foo', { baz: 456 });

    // Assert result is correct
    expect(localStorage.getItem('running-tools.foo')).to.equal('{"baz":456}');
  });
});

describe('migrate method', () => {
  test('should correctly migrate <=1.4.1 calculator options', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.pace-calculator-target-set', '"A"');
    localStorage.setItem('running-tools.race-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.07}');
    localStorage.setItem('running-tools.race-calculator-target-set', '"B"');
    localStorage.setItem('running-tools.split-calculator-target-set', '"C"');
    localStorage.setItem('running-tools.workout-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.08}');
    localStorage.setItem('running-tools.workout-calculator-target-set', '"D"');

    // Run migrations
    utils.migrateLocalStorage();

    // Assert localStorage entries correctly migrated
    expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(
      '{"selectedTargetSet":"A"}');
    expect(localStorage.getItem('running-tools.pace-calculator-target-set')).to.equal(null);
    expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(
      '{"model":"RiegelModel","riegelExponent":1.07,"selectedTargetSet":"B"}');
    expect(localStorage.getItem('running-tools.race-calculator-target-set')).to.equal(null);
    expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(
      '{"selectedTargetSet":"C"}');
    expect(localStorage.getItem('running-tools.split-calculator-target-set')).to.equal(null);
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(
      '{"model":"RiegelModel","riegelExponent":1.08,"selectedTargetSet":"D",' +
      '"customTargetNames":false}');
    expect(localStorage.getItem('running-tools.workout-calculator-target-set')).to.equal(null);
  });

  test('should correctly migrate partial <=1.4.1 calculator options', async () => {
    // Initialize localStorage (*-target-set options missing)
    localStorage.setItem('running-tools.race-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.07}');
    localStorage.setItem('running-tools.workout-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.08}');

    // Run migrations
    utils.migrateLocalStorage();

    // Assert localStorage entries correctly migrated
    expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(
      '{"model":"RiegelModel","riegelExponent":1.07,"selectedTargetSet":"_race_targets"}');
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(
      '{"model":"RiegelModel","riegelExponent":1.08,"selectedTargetSet":"_workout_targets",' +
      '"customTargetNames":false}');
  });


  test('should not modify >1.4.1 calculator options', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.pace-calculator-options',
      '{"selectedTargetSet":"A"}');
    localStorage.setItem('running-tools.race-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.07,"selectedTargetSet":"B"}');
    localStorage.setItem('running-tools.split-calculator-options',
      '{"selectedTargetSet":"C"}');
    localStorage.setItem('running-tools.workout-calculator-options',
      '{"customTargetNames":true,"model":"PurdyPointsModel","riegelExponent":1.08,' +
      '"selectedTargetSet":"D"}');

    // Run migrations
    utils.migrateLocalStorage();

    // Assert localStorage entries not modified
    expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(
      '{"selectedTargetSet":"A"}');
    expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(
      '{"model":"RiegelModel","riegelExponent":1.07,"selectedTargetSet":"B"}');
    expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(
      '{"selectedTargetSet":"C"}');
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(
      '{"customTargetNames":true,"model":"PurdyPointsModel","riegelExponent":1.08,' +
      '"selectedTargetSet":"D"}');
  });

  test('should not modify missing calculator options', async () => {
    // Run migrations
    utils.migrateLocalStorage();

    // Assert localStorage entries not modified
    expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(null);
    expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(null);
    expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(null);
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(null);
  });
});
