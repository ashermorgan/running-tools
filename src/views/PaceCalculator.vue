<template>
  <div class="calculator">
    <h2>Input Pace</h2>
    <div class="input">
      <div>
        Distance:
        <decimal-input v-model="inputDistance" aria-label="Input distance value"
          :min="0" :digits="2"/>
        <select v-model="inputUnit" aria-label="Input distance unit">
          <option v-for="(value, key) in unitUtils.DISTANCE_UNITS" :key="key" :value="key">
            {{ value.name }}
          </option>
        </select>
      </div>
      <div>
        Time:
        <time-input v-model="inputTime" label="Input duration"/>
      </div>
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
        <target-set-selector v-model="selectedTargetSet" @targets-updated="reloadTargets"
          :default-unit-system="defaultUnitSystem"/>
      </div>
    </details>

    <h2>Equivalent Paces</h2>
    <simple-target-table class="output" :calculate-result="calculatePace"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup>
import { computed, onActivated, ref, watch } from 'vue';

import paceUtils from '@/utils/paces';
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
const inputDistance = ref(storage.get('pace-calculator-input-distance', 5));

/**
 * The input distance unit
 */
const inputUnit = ref(storage.get('pace-calculator-input-unit', 'kilometers'));

/**
 * The input time value
 */
const inputTime = ref(storage.get('pace-calculator-input-time', 20 * 60));

/**
 * The default unit system
 *
 * Loaded in onActivated() hook
 */
const defaultUnitSystem = ref(null);

/**
 * The current selected target set
 */
const selectedTargetSet = ref(storage.get('pace-calculator-target-set', '_pace_targets'));

/**
 * The target sets
 *
 * Loaded in onActivated() hook
 */
const targetSets = ref({});

/**
 * Save input distance value
 */
watch(inputDistance, (newValue) => {
  storage.set('pace-calculator-input-distance', newValue);
});

/**
 * Save input distance unit
 */
watch(inputUnit, (newValue) => {
  storage.set('pace-calculator-input-unit', newValue);
});

/**
 * Save input time value
 */
watch(inputTime, (newValue) => {
  storage.set('pace-calculator-input-time', newValue);
});

/**
 * Save default unit system
 */
watch(defaultUnitSystem, (newValue) => {
  storage.set('default-unit-system', newValue);
});

/**
 * Save the current selected target set
 */
watch(selectedTargetSet, (newValue) => {
  storage.set('pace-calculator-target-set', newValue);
});

/**
 * The input pace (in seconds per meter)
 */
const pace = computed(() => {
  const distance = unitUtils.convertDistance(inputDistance.value, inputUnit.value, 'meters');
  return paceUtils.getPace(distance, inputTime.value);
});

/**
 * Reload the target sets
 */
function reloadTargets() {
  targetSets.value = storage.get('target-sets', targetUtils.defaultTargetSets);
}

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

/**
 * (Re)load settings used in multiple calculators
 */
onActivated(() => {
  targetSets.value = storage.get('target-sets', targetUtils.defaultTargetSets);
  defaultUnitSystem.value = storage.get('default-unit-system', unitUtils.detectDefaultUnitSystem());
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
