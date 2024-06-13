<template>
  <table class="split-output-table">
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
          {{ formatUtils.formatDuration(item.time, 3, 2, true) }}
        </td>

        <td>
          <time-input v-model="targets[index].splitTime" label="Split duration" :showHours="false"/>
        </td>

        <td>
          {{ formatUtils.formatDuration(item.pace, 3, 0, true) }}
          / {{ unitUtils.DISTANCE_UNITS[unitUtils.getDefaultDistanceUnit(defaultUnitSystem)]
          .symbol }}
        </td>
      </tr>

      <tr v-if="results.length === 0" class="empty-message">
        <td colspan="5">
          There aren't any targets in this set yet.
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue';

import formatUtils from '@/utils/format';
import unitUtils from '@/utils/units';

import TimeInput from '@/components/TimeInput.vue';

/**
 * The split targets
 */
const targets = defineModel({
  type: Array,
  default: () => [],
})

const props = defineProps({
  /**
   * The unit system to use when showing result paces
   */
  defaultUnitSystem: {
    type: String,
    default: 'metric',
  },
});

/**
 * The target table results
 */
const results = computed(() => {
  // Initialize results array
  const results = [];

  for (let i = 0; i < targets.value.length; i += 1) {
    // Calculate split and total times
    const splitTime = targets.value[i].splitTime || 0;
    const totalTime = i === 0 ? splitTime : results[i - 1].time + splitTime;

    // Calculate split and total distances
    const totalDistance = unitUtils.convertDistance(
      targets.value[i].distanceValue,
      targets.value[i].distanceUnit, 'meters',
    );
    const splitDistance = i === 0 ? totalDistance : totalDistance - results[i - 1].distance;

    // Calculate pace
    const pace = splitTime / unitUtils.convertDistance(splitDistance, 'meters',
      unitUtils.getDefaultDistanceUnit(props.defaultUnitSystem));

    // Add row to results array
    results.push({
      distance: totalDistance,
      distanceValue: targets.value[i].distanceValue,
      distanceUnit: targets.value[i].distanceUnit,
      time: totalTime,
      splitTime,
      pace,
    });
  }

  // Return results array
  return results;
});
</script>

<style scoped>
/* Show/hide mobile abbreviations */
.split-output-table th:first-child span.mobile-abbreviation {
  display: none;
}
@media only screen and (max-width: 500px) {
  .split-output-table th:first-child span:not(.mobile-abbreviation) {
    display: none;
  }
  .split-output-table th:first-child span.mobile-abbreviation {
    display: inherit;
  }
}
</style>
