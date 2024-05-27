<template>
  <div class="calculator">
    <h2>Input Pace</h2>
    <div class="input">
      <pace-input v-model="input"/>
    </div>

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
    </details>

    <h2>Equivalent Paces</h2>
    <simple-target-table class="output" :calculate-result="calculatePace"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import paceUtils from '@/utils/paces';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import PaceInput from '@/components/PaceInput.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/**
 * The input pace
 */
const input = useStorage('pace-calculator-input', {
  distanceValue: 5,
  distanceUnit: 'kilometers',
  time: 1200,
});

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage('default-unit-system', unitUtils.detectDefaultUnitSystem());

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage('pace-calculator-target-set', '_pace_targets');

/**
 * The target sets
 */
const targetSets = useStorage('target-sets', targetUtils.defaultTargetSets);

/**
 * The input pace (in seconds per meter)
 */
const pace = computed(() => {
  const distance = unitUtils.convertDistance(input.value.distanceValue, input.value.distanceUnit,
    'meters');
  return paceUtils.getPace(distance, input.value.time);
});

/**
 * Calculate paces from a target
 * @param {Object} target The target
 * @returns {Object} The result
 */
function calculatePace(target) {
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

    // Calculate time to travel distance at input pace
    const time = paceUtils.getTime(pace.value, d2);

    // Update result
    result.time = time;
  } else {
    // Calculate distance traveled in time at input pace
    let distance = paceUtils.getDistance(pace.value, target.time);

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
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
