<template>
  <div class="calculator">
    <h2>Input Race Result</h2>
    <div class="input">
      <pace-input v-model="input" label="Input race"/>
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
      <race-options v-model="options"/>
    </details>

    <h2>Equivalent Race Results</h2>
    <simple-target-table class="output" :calculate-result="predictResult" :default-unit-system="defaultUnitSystem"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []" show-pace/>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import formatUtils from '@/utils/format';
import raceUtils from '@/utils/races';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import PaceInput from '@/components/PaceInput.vue';
import RaceOptions from '@/components/RaceOptions.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/**
 * The input race
 */
const input = useStorage('race-calculator-input', {
  distanceValue: 5,
  distanceUnit: 'kilometers',
  time: 1200,
});

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage('default-unit-system', unitUtils.detectDefaultUnitSystem());

/**
* The race prediction model
*/
const options = useStorage('race-calculator-options', {
  model: 'AverageModel',
  riegelExponent: 1.06,
});

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage('race-calculator-target-set', '_race_targets');

/**
 * The target sets
 */
let targetSets = useStorage('target-sets', targetUtils.defaultTargetSets);

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
    switch (options.value.model) {
      default:
      case 'AverageModel':
        time = raceUtils.AverageModel.predictTime(d1.value, input.value.time, d2,
          options.value.riegelExponent);
        break;
      case 'PurdyPointsModel':
        time = raceUtils.PurdyPointsModel.predictTime(d1.value, input.value.time, d2);
        break;
      case 'VO2MaxModel':
        time = raceUtils.VO2MaxModel.predictTime(d1.value, input.value.time, d2);
        break;
      case 'RiegelModel':
        time = raceUtils.RiegelModel.predictTime(d1.value, input.value.time, d2,
          options.value.riegelExponent);
        break;
      case 'CameronModel':
        time = raceUtils.CameronModel.predictTime(d1.value, input.value.time, d2);
        break;
    }

    // Update result
    result.time = time;
  } else {
    // Get prediction
    let distance;
    switch (options.value.model) {
      default:
      case 'AverageModel':
        distance = raceUtils.AverageModel.predictDistance(input.value.time, d1.value, target.time,
          options.value.riegelExponent);
        break;
      case 'PurdyPointsModel':
        distance = raceUtils.PurdyPointsModel.predictDistance(input.value.time, d1.value,
          target.time);
        break;
      case 'VO2MaxModel':
        distance = raceUtils.VO2MaxModel.predictDistance(input.value.time, d1.value, target.time);
        break;
      case 'RiegelModel':
        distance = raceUtils.RiegelModel.predictDistance(input.value.time, d1.value, target.time,
          options.value.riegelExponent);
        break;
      case 'CameronModel':
        distance = raceUtils.CameronModel.predictDistance(input.value.time, d1.value, target.time);
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
  return unitUtils.convertDistance(input.value.distanceValue, input.value.distanceUnit, 'meters');
});

/**
 * The Purdy Points for the input race
 */
const purdyPoints = computed(() => {
  const result = raceUtils.PurdyPointsModel.getPurdyPoints(d1.value, input.value.time);
  return result;
});

/**
 * The VO2 Max calculated from the input race
 */
const vo2Max = computed(() => {
  const result = raceUtils.VO2MaxModel.getVO2Max(d1.value, input.value.time);
  return result;
});

/**
 * The VO2 calculated from the input race
 */
const vo2 = computed(() => {
  const result = raceUtils.VO2MaxModel.getVO2(d1.value, input.value.time);
  return result;
});

/**
 * The percentage of VO2 Max calculated from the input race
 */
const vo2Percentage = computed(() => {
  const result = raceUtils.VO2MaxModel.getVO2Percentage(input.value.time) * 100;
  return result;
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
