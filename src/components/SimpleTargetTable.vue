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
            {{ formatNumber(item.distanceValue, 0, 2, item.result === 'distance') }}
            {{ distanceUnits[item.distanceUnit].symbol }}
          </td>

          <td :class="item.result === 'time' ? 'result' : ''">
            {{ formatDuration(item.time, 3, 2, item.result === 'time') }}
          </td>

          <td v-if="showPace">
            {{ formatDuration(getPace(item), 3, 0, true) }}
            / {{ distanceUnits[getDefaultDistanceUnit()].symbol }}
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

<script>
import formatUtils from '@/utils/format';
import unitUtils from '@/utils/units';

import blur from '@/directives/blur';

export default {
  name: 'SimpleTargetTable',

  directives: {
    blur,
  },

  props: {
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
  },

  data() {
    return {
      /**
       * The distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,

      /**
       * The formatDuration method
       */
      formatDuration: formatUtils.formatDuration,

      /**
       * The formatNumber method
       */
      formatNumber: formatUtils.formatNumber,

      /**
       * The getDefaultDistanceUnit method
       */
      getDefaultDistanceUnit: unitUtils.getDefaultDistanceUnit,
    };
  },

  computed: {
    /**
     * The target table results
     */
    results() {
      // Calculate results
      const result = [];
      this.targets.forEach((row) => {
        // Add result
        result.push(this.calculateResult(row));
      });

      // Sort results by time
      result.sort((a, b) => a.time - b.time);

      // Return results
      return result;
    },
  },

  methods: {
    /**
     * Get the pace of a result
     * @param {Object} result The result
     */
    getPace(result) {
      return result.time / unitUtils.convertDistance(result.distanceValue, result.distanceUnit,
        unitUtils.getDefaultDistanceUnit());
    },
  },
};
</script>

<style scoped>
/* target table */
.results .result {
  font-weight: bold;
}
</style>
