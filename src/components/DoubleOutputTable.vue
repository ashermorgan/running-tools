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

<script setup lang="ts">
import { computed } from 'vue';

import { ResultType } from '@/utils/calculators';
import type { TargetResult } from '@/utils/calculators';
import type { Target } from '@/utils/targets';
import { formatDistance, formatDuration } from '@/utils/units';
import type { Distance, DistanceTime } from '@/utils/units';

interface Props {
  /**
   * The method that generates the target table rows
   */
  calculateResult: (x: DistanceTime, y: Target) => TargetResult,

  /**
   * The target set
   */
  targets: Array<Target>,

  /**
   * The set of input times
   */
  inputTimes: Array<number>,

  /**
   * The input distance
   */
  inputDistance: Distance,
}

const props = defineProps<Props>();

/**
 * The target table results
 */
const results = computed(() => {
  // Calculate results
  const results: Array<Array<string>> = [[
    formatDistance(props.inputDistance, false),
  ]];

  props.inputTimes.forEach((input, y) => {
    const row = [formatDuration(input, 3, 2, false)];

    props.targets.forEach(target => {
      const result = props.calculateResult({ ...props.inputDistance, time: input }, target);

      if (y === 0) {
        results[0].push(result[result.result === ResultType.Key ? 'value' : 'key']);
      }

      row.push(result[result.result]);
    });
    results.push(row);
  });
  return results;
});
</script>

<style scoped>
table th, table td {
  /* Add more space between table cells */
  padding: 0.2em 0.5em;
}
</style>
