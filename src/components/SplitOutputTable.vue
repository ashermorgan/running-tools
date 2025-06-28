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
          {{ DistanceUnitData[item.distanceUnit].symbol }}
        </td>

        <td>
          {{ formatDuration(item.time, 3, 2, true) }}
        </td>

        <td>
          <time-input v-model="model[index].splitTime" label="Split duration" :showHours="false"/>
        </td>

        <td>
          {{ formatDuration(item.pace, 3, 0, true) }}
          / {{ DistanceUnitData[getDefaultDistanceUnit(defaultUnitSystem)]
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

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

import { formatDuration, formatNumber } from '@/utils/format';
import type { SplitTarget } from '@/utils/targets';
import { DistanceUnits, DistanceUnitData, UnitSystems, convertDistance,
  getDefaultDistanceUnit } from '@/utils/units';

import TimeInput from '@/components/TimeInput.vue';
import useObjectModel from '@/composables/useObjectModel';

interface SplitTargetResult {
  distance: number,
  distanceValue: number,
  distanceUnit: DistanceUnits,
  time: number,
  splitTime: number,
  pace: number,
};

interface Props {
  /**
   * The unit system to use when showing result paces
   */
  defaultUnitSystem?: UnitSystems,

  /**
   * The split targets
   */
  modelValue?: Array<SplitTarget>,
};

const props = withDefaults(defineProps<Props>(), {
  defaultUnitSystem: UnitSystems.Metric,
  modelValue: [],
});

// Generate internal ref tied to modelValue prop
const emit = defineEmits(['update:modelValue']);
const model = useObjectModel<Array<SplitTarget>>(() => props.modelValue,
  (x) => emit('update:modelValue', x));

/**
 * The target table results
 */
const results = computed(() => {
  // Initialize results array
  const results: Array<SplitTargetResult> = [];

  for (let i = 0; i < model.value.length; i += 1) {
    // Calculate split and total times
    const splitTime = model.value[i].splitTime || 0;
    const totalTime = i === 0 ? splitTime : results[i - 1].time + splitTime;

    // Calculate split and total distances
    const totalDistance = convertDistance(
      model.value[i].distanceValue,
      model.value[i].distanceUnit, DistanceUnits.Meters,
    );
    const splitDistance = i === 0 ? totalDistance : totalDistance - results[i - 1].distance;

    // Calculate pace
    const pace = splitTime / convertDistance(splitDistance, DistanceUnits.Meters,
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
