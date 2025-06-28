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
          <td :class="item.result === 'key' ? 'result' : ''">
            {{ item.key }}
          </td>

          <td :class="item.result === 'value' ? 'result' : ''">
            {{ item.value }}
          </td>

          <td v-if="showPace">
            {{ item.pace }}
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

<script setup lang="ts">
import { computed } from 'vue';

import type { TargetResult } from '@/utils/calculators';
import type { Target } from '@/utils/targets';

interface Props {
  /**
   * The method that generates the target table rows
   */
  calculateResult: (x: Target) => TargetResult,

  /**
   * The target set
   */
  targets: Array<Target>,

  /**
   * Whether to show result paces (defaults to false)
   */
  showPace?: boolean,
};

const props = withDefaults(defineProps<Props>(), { showPace: false });

/**
 * The target table results
 */
const results = computed(() => {
  // Calculate results
  const result: Array<TargetResult> = [];
  props.targets.forEach((row) => {
    // Add result
    result.push(props.calculateResult(row));
  });

  // Sort results
  result.sort((a, b) => a.sort - b.sort);

  // Return results
  return result;
});
</script>

<style scoped>
/* target table */
.results .result {
  font-weight: bold;
}
</style>
