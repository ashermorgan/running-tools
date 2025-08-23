import { beforeEach, describe, test, expect } from 'vitest';
import { migrateLocalStorage } from '@/core/migrations';
import { detectDefaultUnitSystem } from '@/core/units';

beforeEach(() => {
  localStorage.clear();
});

describe('migrateLocalStorage method', () => {
  test('should correctly migrate <=1.4.1 calculator options', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.default-unit-system', '"imperial"');

    localStorage.setItem('running-tools.batch-calculator-input',
      '{"distanceValue":100,"distanceUnit":"meters","time":10}');
    localStorage.setItem('running-tools.batch-calculator-options',
      '{"calculator":"race","increment":32,"rows":15}');

    localStorage.setItem('running-tools.pace-calculator-input',
      '{"distanceValue":110,"distanceUnit":"meters","time":11}');
    localStorage.setItem('running-tools.pace-calculator-target-set', '"A"');

    localStorage.setItem('running-tools.race-calculator-input',
      '{"distanceValue":120,"distanceUnit":"meters","time":12}');
    localStorage.setItem('running-tools.race-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.07}');
    localStorage.setItem('running-tools.race-calculator-target-set', '"B"');

    localStorage.setItem('running-tools.split-calculator-target-set', '"C"');

    localStorage.setItem('running-tools.workout-calculator-input',
      '{"distanceValue":130,"distanceUnit":"meters","time":13}');
    localStorage.setItem('running-tools.workout-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.08}');
    localStorage.setItem('running-tools.workout-calculator-target-set', '"D"');

    // Run migrations
    migrateLocalStorage();

    // Assert localStorage entries correctly migrated
    expect(localStorage.getItem('running-tools.default-unit-system')).to.equal(null);
    expect(localStorage.getItem('running-tools.global-options')).to.equal(
      '{"defaultUnitSystem":"imperial","racePredictionOptions":{"model":"RiegelModel",' +
      '"riegelExponent":1.07}}');

    expect(localStorage.getItem('running-tools.batch-calculator-input')).to.equal(null);
    expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(
      '{"calculator":"race","increment":32,"rows":15,"label":"",' +
      '"input":{"distanceValue":100,"distanceUnit":"meters","time":10}}');

    expect(localStorage.getItem('running-tools.pace-calculator-input')).to.equal(null);
    expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(
      '{"input":{"distanceValue":110,"distanceUnit":"meters","time":11},"selectedTargetSet":"A"}');
    expect(localStorage.getItem('running-tools.pace-calculator-target-set')).to.equal(null);

    expect(localStorage.getItem('running-tools.race-calculator-input')).to.equal(null);
    expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(
      '{"input":{"distanceValue":120,"distanceUnit":"meters","time":12},"selectedTargetSet":"B"}');
    expect(localStorage.getItem('running-tools.race-calculator-target-set')).to.equal(null);

    expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(
      '{"selectedTargetSet":"C"}');
    expect(localStorage.getItem('running-tools.split-calculator-target-set')).to.equal(null);

    expect(localStorage.getItem('running-tools.workout-calculator-input')).to.equal(null);
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(
      '{"customTargetNames":false,"input":{"distanceValue":130,"distanceUnit":"meters",' +
      '"time":13},"selectedTargetSet":"D"}');
    expect(localStorage.getItem('running-tools.workout-calculator-target-set')).to.equal(null);
  });

  test('should correctly migrate partial <=1.4.1 calculator options using default values', async () => {
    // Initialize localStorage
    // default-unit-system, *-calculator-input, and *-calculator-target-set left undefined
    localStorage.setItem('running-tools.batch-calculator-options',
      '{"calculator":"race","increment":32,"rows":15}');
    localStorage.setItem('running-tools.race-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.07}');
    localStorage.setItem('running-tools.workout-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.08}');

    // Run migrations
    migrateLocalStorage();

    // Assert localStorage entries correctly migrated
    const defaultUnitSystem = detectDefaultUnitSystem();
    expect(localStorage.getItem('running-tools.global-options')).to.equal(
      `{"defaultUnitSystem":"${defaultUnitSystem}",` +
      '"racePredictionOptions":{"model":"RiegelModel","riegelExponent":1.07}}');
    expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(
      '{"calculator":"race","increment":32,"rows":15,"label":"",' +
      '"input":{"distanceValue":5,"distanceUnit":"kilometers","time":1200}}');
    expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(
      '{"input":{"distanceValue":5,"distanceUnit":"kilometers","time":1200},' +
      '"selectedTargetSet":"_race_targets"}');
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(
      '{"customTargetNames":false,"input":{"distanceValue":5,"distanceUnit":"kilometers",' +
      '"time":1200},"selectedTargetSet":"_workout_targets"}');
  });

  test('should not modify >1.4.1 calculator options', async () => {
    // Initialize localStorage
    localStorage.setItem('running-tools.global-calculator-options',
      '{"model":"RiegelModel","riegelExponent":1.07}');
    localStorage.setItem('running-tools.batch-calculator-options',
      '{"calculator":"race","increment":32,"input":{"distanceValue":100,"distanceUnit":"meters",' +
      '"time":10},"label":"foo","rows":15}');
    localStorage.setItem('running-tools.pace-calculator-options',
      '{"input":{"distanceValue":110,"distanceUnit":"meters","time":11},"selectedTargetSet":"A"}');
    localStorage.setItem('running-tools.race-calculator-options',
      '{"input":{"distanceValue":120,"distanceUnit":"meters","time":12},"selectedTargetSet":"B"}');
    localStorage.setItem('running-tools.split-calculator-options',
      '{"selectedTargetSet":"C"}');
    localStorage.setItem('running-tools.workout-calculator-options',
      '{"customTargetNames":true,"input":{"distanceValue":120,"distanceUnit":"meters","time":12},' +
      '"selectedTargetSet":"D"}');

    // Run migrations
    migrateLocalStorage();

    // Assert localStorage entries not modified
    expect(localStorage.getItem('running-tools.global-calculator-options')).to.equal(
      '{"model":"RiegelModel","riegelExponent":1.07}');
    expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(
      '{"calculator":"race","increment":32,"input":{"distanceValue":100,"distanceUnit":"meters",' +
      '"time":10},"label":"foo","rows":15}');
    expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(
      '{"input":{"distanceValue":110,"distanceUnit":"meters","time":11},"selectedTargetSet":"A"}');
    expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(
      '{"input":{"distanceValue":120,"distanceUnit":"meters","time":12},"selectedTargetSet":"B"}');
    expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(
      '{"selectedTargetSet":"C"}');
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(
      '{"customTargetNames":true,"input":{"distanceValue":120,"distanceUnit":"meters","time":12},' +
      '"selectedTargetSet":"D"}');
  });

  test('should not modify missing calculator options', async () => {
    // Run migrations
    migrateLocalStorage();

    // Assert localStorage entries not modified
    expect(localStorage.getItem('running-tools.global-options')).to.equal(null);
    expect(localStorage.getItem('running-tools.batch-calculator-options')).to.equal(null);
    expect(localStorage.getItem('running-tools.pace-calculator-options')).to.equal(null);
    expect(localStorage.getItem('running-tools.race-calculator-options')).to.equal(null);
    expect(localStorage.getItem('running-tools.split-calculator-options')).to.equal(null);
    expect(localStorage.getItem('running-tools.workout-calculator-options')).to.equal(null);
  });
});
