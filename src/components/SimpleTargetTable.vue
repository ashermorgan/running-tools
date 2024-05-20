<template>
  <div class="simple-target-table">
    <table class="results">
      <thead>
        <tr>
          <th>Distance</th>

          <th>Time</th>

          <th v-if="showPace">Pace</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in results" :key="index">
          <td :class="item.result === 'distance' ? 'result' : ''">
            {{ formatUtils.formatNumber(item.distanceValue, 0, 2, item.result === 'distance') }}
            {{ unitUtils.DISTANCE_UNITS[item.distanceUnit].symbol }}
          </td>

          <td :class="item.result === 'time' ? 'result' : ''">
            {{ formatUtils.formatDuration(item.time, 3, 2, item.result === 'time') }}
          </td>

          <td v-if="showPace">
            {{ formatUtils.formatDuration(getPace(item), 3, 0, true) }}
            / {{ unitUtils.DISTANCE_UNITS[unitUtils.getDefaultDistanceUnit(defaultUnitSystem)]
              .symbol }}
          </td>
        </tr>

        <tr v-if="results.length === 0" class="empty-message">
          <td colspan="4">
            There aren't any targets in this set yet.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import formatUtils from '@/utils/format';
import unitUtils from '@/utils/units';

const props = defineProps({
  /**
   * The method that generates the target table rows
   */
  calculateResult: {
    type: Function,
    required: true,
  },

  /**
   * The target set
   */
  targets: {
    type: Array,
    default: () => [],
  },

  /**
   * Whether to show result paces
   */
  showPace: {
    type: Boolean,
    default: false,
  },

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
  // Calculate results
  const result = [];
  props.targets.forEach((row) => {
    // Add result
    result.push(props.calculateResult(row));
  });

  // Sort results by time
  result.sort((a, b) => a.time - b.time);

  // Return results
  return result;
});

/**
 * Get the pace of a result
 * @param {Object} result The result
 */
function getPace(result) {
  return result.time / unitUtils.convertDistance(result.distanceValue, result.distanceUnit,
    unitUtils.getDefaultDistanceUnit(props.defaultUnitSystem));
}
</script>

<style scoped>
/* target table */
.results .result {
  font-weight: bold;
}
</style>
