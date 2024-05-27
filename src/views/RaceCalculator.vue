<template>
  <div class="calculator">
    <h2>Input Race Result</h2>
    <div class="input">
      <div>
        Distance:
        <decimal-input v-model="inputDistance" aria-label="Input distance value" :min="0" :digits="2"/>
        <select v-model="inputUnit" aria-label="Input distance unit">
          <option v-for="(value, key) in unitUtils.DISTANCE_UNITS" :key="key" :value="key">
            {{ value.name }}
          </option>
        </select>
      </div>
      <div>
        Time:
        <time-input v-model="inputTime" label="Input race duration"/>
      </div>
    </div>

    <details>
      <summary>
        <h2>Race Statistics</h2>
      </summary>
      <div>
        Purdy Points: <b>{{ formatUtils.formatNumber(purdyPoints, 0, 1, true) }}</b>
      </div>
      <div>
        V&#775;O&#8322;: <b>{{ formatUtils.formatNumber(vo2, 0, 1, true) }}</b> ml/kg/min
          (<b>{{ formatUtils.formatNumber(vo2Percentage, 0, 1, true) }}%</b> of max)
      </div>
      <div>
        V&#775;O&#8322; Max: <b>{{ formatUtils.formatNumber(vo2Max, 0, 1, true) }}</b> ml/kg/min
      </div>
    </details>

    <details>
      <summary>
        <h2>Advanced Options</h2>
      </summary>
      <div>
        Default units:
        <select v-model="defaultUnitSystem" aria-label="Default units">
          <option value="imperial">Miles</option>
          <option value="metric">Kilometers</option>
        </select>
      </div>
      <div>
        Target Set:
        <target-set-selector v-model:selectedTargetSet="selectedTargetSet"
          v-model:targetSets="targetSets" :default-unit-system="defaultUnitSystem"/>
      </div>
      <div>
        Prediction Model:
        <select v-model="model" aria-label="Prediction model">
          <option value="AverageModel">Average</option>
          <option value="PurdyPointsModel">Purdy Points Model</option>
          <option value="VO2MaxModel">V&#775;O&#8322; Max Model</option>
          <option value="CameronModel">Cameron's Model</option>
          <option value="RiegelModel">Riegel's Model</option>
        </select>
      </div>
      <div>
        Riegel Exponent:
        <decimal-input v-model="riegelExponent" aria-label="Riegel exponent" :min="1" :max="1.3"
          :digits="2" :step="0.01"/>
        (default: 1.06)
      </div>
    </details>

    <h2>Equivalent Race Results</h2>
    <simple-target-table class="output" :calculate-result="predictResult" :default-unit-system="defaultUnitSystem"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []" show-pace/>
  </div>
</template>

<script setup>
import { computed, onActivated, ref, watch } from 'vue';

import formatUtils from '@/utils/format';
import raceUtils from '@/utils/races';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';
import TimeInput from '@/components/TimeInput.vue';

/**
 * The input distance value
 */
const inputDistance = ref(storage.get('race-calculator-input-distance', 5));

/**
 * The input distance unit
 */
const inputUnit = ref(storage.get('race-calculator-input-unit', 'kilometers'));

/**
 * The input time value
 */
const inputTime = ref(storage.get('race-calculator-input-time', 20 * 60));

/**
 * The default unit system
 *
 * Loaded in onActivated() hook
 */
const defaultUnitSystem = ref(null);

/**
* The race prediction model
*/
const model = ref(storage.get('race-calculator-model', 'AverageModel'));

/**
* The value of the exponent in Riegel's Model
*/
const riegelExponent = ref(storage.get('race-calculator-riegel-exponent', 1.06));

/**
 * The current selected target set
 */
const selectedTargetSet = ref(storage.get('race-calculator-target-set', '_race_targets'));

/**
 * The target sets
 *
 * Loaded in onActivated() hook
 */
let targetSets = ref({});

/**
 * Reload the target sets
 */
function reloadTargets() {
  targetSets.value = storage.get('target-sets', targetUtils.defaultTargetSets);
}

/**
 * Predict race results from a target
 * @param {Object} target The target
 * @returns {Object} The result
 */
function predictResult(target) {
  // Initialize result
  const result = {
    distanceValue: target.distanceValue,
    distanceUnit: target.distanceUnit,
    time: target.time,
    result: target.result,
  };

  // Add missing value to result
  if (target.result === 'time') {
    // Convert target distance into meters
    const d2 = unitUtils.convertDistance(target.distanceValue, target.distanceUnit, 'meters');

    // Get prediction
    let time;
    switch (model.value) {
      default:
      case 'AverageModel':
        time = raceUtils.AverageModel.predictTime(d1.value, inputTime.value, d2,
          riegelExponent.value);
        break;
      case 'PurdyPointsModel':
        time = raceUtils.PurdyPointsModel.predictTime(d1.value, inputTime.value, d2);
        break;
      case 'VO2MaxModel':
        time = raceUtils.VO2MaxModel.predictTime(d1.value, inputTime.value, d2);
        break;
      case 'RiegelModel':
        time = raceUtils.RiegelModel.predictTime(d1.value, inputTime.value, d2,
          riegelExponent.value);
        break;
      case 'CameronModel':
        time = raceUtils.CameronModel.predictTime(d1.value, inputTime.value, d2);
        break;
    }

    // Update result
    result.time = time;
  } else {
    // Get prediction
    let distance;
    switch (model.value) {
      default:
      case 'AverageModel':
        distance = raceUtils.AverageModel.predictDistance(inputTime.value, d1.value, target.time,
          riegelExponent.value);
        break;
      case 'PurdyPointsModel':
        distance = raceUtils.PurdyPointsModel.predictDistance(inputTime.value, d1.value,
          target.time);
        break;
      case 'VO2MaxModel':
        distance = raceUtils.VO2MaxModel.predictDistance(inputTime.value, d1.value, target.time);
        break;
      case 'RiegelModel':
        distance = raceUtils.RiegelModel.predictDistance(inputTime.value, d1.value, target.time,
          riegelExponent.value);
        break;
      case 'CameronModel':
        distance = raceUtils.CameronModel.predictDistance(inputTime.value, d1.value, target.time);
        break;
    }

    // Convert output distance into default distance unit
    distance = unitUtils.convertDistance(distance, 'meters',
      unitUtils.getDefaultDistanceUnit(defaultUnitSystem.value));

    // Update result
    result.distanceValue = distance;
    result.distanceUnit = unitUtils.getDefaultDistanceUnit(defaultUnitSystem.value);
  }

  // Return result
  return result;
}

/**
 * The input distance in meters
 */
const d1 = computed(() => {
  return unitUtils.convertDistance(inputDistance.value, inputUnit.value, 'meters');
});

/**
 * The Purdy Points for the input race
 */
const purdyPoints = computed(() => {
  const result = raceUtils.PurdyPointsModel.getPurdyPoints(d1.value, inputTime.value);
  return result;
});

/**
 * The VO2 Max calculated from the input race
 */
const vo2Max = computed(() => {
  const result = raceUtils.VO2MaxModel.getVO2Max(d1.value, inputTime.value);
  return result;
});

/**
 * The VO2 calculated from the input race
 */
const vo2 = computed(() => {
  const result = raceUtils.VO2MaxModel.getVO2(d1.value, inputTime.value);
  return result;
});

/**
 * The percentage of VO2 Max calculated from the input race
 */
const vo2Percentage = computed(() => {
  const result = raceUtils.VO2MaxModel.getVO2Percentage(inputTime.value) * 100;
  return result;
});

/**
 * Save input distance value
 */
watch(inputDistance, (newValue) => {
  storage.set('race-calculator-input-distance', newValue);
});

/**
 * Save input distance unit
 */
watch(inputUnit, (newValue) => {
  storage.set('race-calculator-input-unit', newValue);
});

/**
 * Save input time value
 */
watch(inputTime, (newValue) => {
  storage.set('race-calculator-input-time', newValue);
});

/**
 * Save default unit system
 */
watch(defaultUnitSystem, (newValue) => {
  storage.set('default-unit-system', newValue);
});

/**
 * Save prediction model
 */
watch(model, (newValue) => {
  storage.set('race-calculator-model', newValue);
});

/**
 * Save Riegel Model exponent
 */
watch(riegelExponent, (newValue) => {
  storage.set('race-calculator-riegel-exponent', newValue);
});

/**
 * Save the current selected target set
 */
watch(selectedTargetSet, (newValue) => {
  storage.set('race-calculator-target-set', newValue);
});

/**
 * Save target sets
 */
watch(targetSets, (newValue) => {
  storage.set('target-sets', newValue);
}, { deep: true });

/**
* (Re)load settings used in multiple calculators
*/
onActivated(() => {
  reloadTargets();
  defaultUnitSystem.value = storage.get('default-unit-system', unitUtils.detectDefaultUnitSystem());
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
