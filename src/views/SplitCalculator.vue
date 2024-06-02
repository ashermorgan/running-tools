<template>
  <div class="calculator">
    <div class="default-units">
      Default units:
      <select v-model="defaultUnitSystem" aria-label="Default units">
        <option value="imperial">Miles</option>
        <option value="metric">Kilometers</option>
      </select>
    </div>

    <div class="target-set">
      Target Set:
      <target-set-selector v-model:selectedTargetSet="selectedTargetSet"
        v-model:targetSets="targetSets" :default-unit-system="defaultUnitSystem"/>
    </div>

    <div class="output">
      <table class="results">
        <thead>
          <tr>
            <th>
              <span>Distance</span>
              <span class="mobile-abbreviation">Dist.</span>
            </th>

            <th>Time</th>

            <th>Split</th>

            <th>Pace</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in results" :key="index">
            <td>
              {{ formatUtils.formatNumber(item.distanceValue, 0, 2, false) }}
              {{ unitUtils.DISTANCE_UNITS[item.distanceUnit].symbol }}
            </td>

            <td>
              {{ formatUtils.formatDuration(item.totalTime, 3, 2, true) }}
            </td>

            <td v-if="targetSets[selectedTargetSet]">
              <time-input v-model="targetSets[selectedTargetSet].targets[index].split"
                label="Split duration" :showHours="false"/>
            </td>

            <td>
              {{ formatUtils.formatDuration(item.pace, 3, 0, true) }}
              / {{ unitUtils.DISTANCE_UNITS[unitUtils.getDefaultDistanceUnit(defaultUnitSystem)]
                .symbol }}
            </td>
          </tr>

          <tr v-if="!targetSets[selectedTargetSet] || targetSets[selectedTargetSet].targets.length === 0" class="empty-message">
            <td colspan="5">
              There aren't any targets in this set yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import formatUtils from '@/utils/format';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import TargetSetSelector from '@/components/TargetSetSelector.vue';
import TimeInput from '@/components/TimeInput.vue';

import useStorage from '@/composables/useStorage';

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage('default-unit-system', unitUtils.detectDefaultUnitSystem());

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage('split-calculator-target-set', '_split_targets');

/**
 * The default output targets
 */
const targetSets = useStorage('split-calculator-target-sets', {
  _split_targets: targetUtils.defaultTargetSets._split_targets
});

/**
 * The target table results
 */
const results = computed(() => {
  // Initialize results array
  const results = [];

  // Check for missing target set
  if (!targetSets.value[selectedTargetSet.value]) return [];

  let targets = targetUtils.sort(targetSets.value[selectedTargetSet.value].targets.filter(x =>
    x.result === 'time'));

  for (let i = 0; i < targets.length; i += 1) {
    // Calculate split and total times
    const splitTime = targets[i].split || 0;
    const totalTime = i === 0 ? splitTime : results[i - 1].totalTime + splitTime;

    // Calculate split and total distances
    const totalDistance = unitUtils.convertDistance(
      targets[i].distanceValue,
      targets[i].distanceUnit, 'meters',
    );
    const splitDistance = i === 0 ? totalDistance : totalDistance - results[i - 1].distance;

    // Calculate pace
    const pace = splitTime / unitUtils.convertDistance(splitDistance, 'meters',
      unitUtils.getDefaultDistanceUnit(defaultUnitSystem.value));

    // Add row to results array
    results.push({
      distance: totalDistance,
      distanceValue: targets[i].distanceValue,
      distanceUnit: targets[i].distanceUnit,
      totalTime,
      splitTime,
      pace,
    });
  }

  // Return results array
  return results;
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';

.target-set, .default-units {
  margin-bottom: 5px;
}

/* Widen default calculator output */
@media only screen and (min-width: 501px) {
  .output {
    min-width: 400px;
  }
}

/* Show/hide mobile abbreviations */
.results th:first-child span.mobile-abbreviation {
  display: none;
}
@media only screen and (max-width: 500px) {
  .results th:first-child span:not(.mobile-abbreviation) {
    display: none;
  }
  .results th:first-child span.mobile-abbreviation {
    display: inherit;
  }
}
</style>
