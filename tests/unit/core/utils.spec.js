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

describe('getLocalStorage method', () => {
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

describe('setLocalStorage method', () => {
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

describe('unsetLocalStorage method', () => {
  test('should correctly remove existing localStorage item', async () => {
    // Set localStorage item
    localStorage.setItem('running-tools.foo', '1');
    localStorage.setItem('running-tools.bar', '2');

    // Remove localStorage item
    utils.unsetLocalStorage('bar');

    // Assert localStorage updated correctly
    expect(localStorage.getItem('running-tools.foo')).to.equal('1');
    expect(localStorage.getItem('running-tools.bar')).to.equal(null);
    expect(localStorage.length).to.equal(1);
  });

  test('should remove non-existant localStorage item without error', async () => {
    // Set localStorage item
    localStorage.setItem('running-tools.foo', '1');

    // Remove localStorage item
    utils.unsetLocalStorage('missing');

    // Assert localStorage updated correctly
    expect(localStorage.length).to.equal(1);
    expect(localStorage.getItem('running-tools.foo')).to.equal('1');
  });
});
