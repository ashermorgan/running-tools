<template>
  <div class="double-target-table">
    <table class="results">
      <thead>
        <tr>
          <th v-for="(col, x) in results[0]" :key="x">
            {{ col }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, y) in results.slice(1)" :key="y">
          <td v-for="(col, x) in row" :key="x">
            {{ col }}
          </td>
        </tr>

        <tr v-if="results.length === 1" class="empty-message">
          <td colspan="4">
            No inputs were specified.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDuration, formatNumber } from '@/utils/format';
import { DISTANCE_UNITS } from '@/utils/units';

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
   * The set of input times
   */
  inputTimes: {
    type: Array,
    default: () => [],
  },

  /**
   * The input distance
   */
  inputDistance: {
    type: Object,
    default: () => ({
      distanceValue: 5,
      distanceUnit: 'kilometers',
    }),
  }
});

/**
 * The target table results
 */
const results = computed(() => {
  // Calculate results
  const results = [[
    formatNumber(props.inputDistance.distanceValue, 0, 2, false) + ' '
      + DISTANCE_UNITS[props.inputDistance.distanceUnit].symbol
  ]];

  props.inputTimes.forEach((input, y) => {
    let row = [formatDuration(input, 3, 2, false)];

    props.targets.forEach(target => {
      let result = props.calculateResult({ ...props.inputDistance, time: input }, target);

      if (y === 0) {
        results[0].push(result[result.result === 'key' ? 'value' : 'key']);
      }

      row.push(result[result.result]);
    });
    results.push(row);
  });
  return results;
});
</script>
