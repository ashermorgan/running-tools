import { describe, test, expect } from 'vitest';
import * as miscUtils from '@/utils/misc';

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
    let output = miscUtils.deepCopy(input);

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
    expect(miscUtils.deepEqual(obj1, obj1)).to.equal(true);
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
    expect(miscUtils.deepEqual(obj1, obj2)).to.equal(true);
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
    expect(miscUtils.deepEqual(obj1, obj2)).to.equal(false);
  });
});
