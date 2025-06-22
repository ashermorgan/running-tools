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
          {{ formatNumber(item.distanceValue, 0, 2, false) }}
          {{ DISTANCE_UNITS[item.distanceUnit].symbol }}
        </td>

        <td>
          {{ formatDuration(item.time, 3, 2, true) }}
        </td>

        <td>
          <time-input v-model="model[index].splitTime" label="Split duration" :showHours="false"/>
        </td>

        <td>
          {{ formatDuration(item.pace, 3, 0, true) }}
          / {{ DISTANCE_UNITS[getDefaultDistanceUnit(defaultUnitSystem)]
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

import { formatDuration, formatNumber } from '@/utils/format';
import { DISTANCE_UNITS, convertDistance, getDefaultDistanceUnit } from '@/utils/units';

import TimeInput from '@/components/TimeInput.vue';
import useObjectModel from '@/composables/useObjectModel';

const props = defineProps({
  /**
   * The unit system to use when showing result paces
   */
  defaultUnitSystem: {
    type: String,
    default: 'metric',
  },

  /**
   * The split targets
   */
  modelValue: {
    type: Array,
    default: () => [],
  },
});

// Generate internal ref tied to modelValue prop
const emit = defineEmits(['update:modelValue']);
const model = useObjectModel(() => props.modelValue, emit, 'modelValue');

/**
 * The target table results
 */
const results = computed(() => {
  // Initialize results array
  const results = [];

  for (let i = 0; i < model.value.length; i += 1) {
    // Calculate split and total times
    const splitTime = model.value[i].splitTime || 0;
    const totalTime = i === 0 ? splitTime : results[i - 1].time + splitTime;

    // Calculate split and total distances
    const totalDistance = convertDistance(
      model.value[i].distanceValue,
      model.value[i].distanceUnit, 'meters',
    );
    const splitDistance = i === 0 ? totalDistance : totalDistance - results[i - 1].distance;

    // Calculate pace
    const pace = splitTime / convertDistance(splitDistance, 'meters',
      getDefaultDistanceUnit(props.defaultUnitSystem));

    // Add row to results array
    results.push({
      distance: totalDistance,
      distanceValue: model.value[i].distanceValue,
      distanceUnit: model.value[i].distanceUnit,
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
