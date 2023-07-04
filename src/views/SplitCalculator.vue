<template>
  <div class="split-calculator">
    <div class="output">
      <table class="results" v-show="!inEditMode">
        <thead>
          <tr>
            <th>
              <span>Distance</span>
              <span class="mobile-abbreviation">Dist</span>
            </th>

            <th>Time</th>

            <th>Split</th>

            <th>Pace</th>

            <th>
              <button class="icon" title="Edit Targets" @click="inEditMode=true" v-blur>
                <vue-feather type="edit"/>
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in results" :key="index">
            <td>
              {{ formatNumber(item.distanceValue, 0, 2, false) }}
              {{ distanceUnits[item.distanceUnit].symbol }}
            </td>

            <td>
              {{ formatDuration(item.totalTime, 3, 2, true) }}
            </td>

            <td>
              <time-input v-model="targets[index].split" :showHours="false"/>
            </td>

            <td colspan="2">
              {{ formatDuration(item.pace, 3, 0, true) }}
              / {{ distanceUnits[getDefaultDistanceUnit()].symbol }}
            </td>
          </tr>

          <tr v-if="targets.length === 0" class="empty-message">
            <td colspan="5">
              There aren't any targets yet,<br>
              click
              <vue-feather type="edit"/>
              to edit the list of targets
            </td>
          </tr>
        </tbody>
      </table>

      <target-editor v-model="targets" :time-targets="false" v-show="inEditMode"
        @close="inEditMode=false" @reset="resetTargets"/>
    </div>
  </div>
</template>

<script>
import VueFeather from 'vue-feather';

import formatUtils from '@/utils/format';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import TimeInput from '@/components/TimeInput.vue';
import TargetEditor from '@/components/TargetEditor.vue';

import blur from '@/directives/blur';

const defaultTargets = [
  { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
  { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
  { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
];
const storageKey = 'split-calculator-targets-v2';

export default {
  name: 'SplitCalculator',

  components: {
    TimeInput,
    TargetEditor,
    VueFeather,
  },

  directives: {
    blur,
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

      /**
       * Whether the table is in edit mode
       */
      inEditMode: false,

      /**
       * The target table targets
       */
      targets: storage.get(storageKey, defaultTargets),
    };
  },

  computed: {
    /**
     * The target table results
     */
    results() {
      // Initialize results array
      const results = [];

      for (let i = 0; i < this.targets.length; i += 1) {
        // Calculate split and total times
        const splitTime = this.targets[i].split || 0;
        const totalTime = i === 0 ? splitTime : results[i - 1].totalTime + splitTime;

        // Calculate split and total distances
        const totalDistance = unitUtils.convertDistance(this.targets[i].distanceValue,
          this.targets[i].distanceUnit, 'meters');
        const splitDistance = i === 0 ? totalDistance : totalDistance - results[i - 1].distance;

        // Calculate pace
        const pace = splitTime / unitUtils.convertDistance(splitDistance, 'meters',
          unitUtils.getDefaultDistanceUnit());

        // Add row to results array
        results.push({
          distance: totalDistance,
          distanceValue: this.targets[i].distanceValue,
          distanceUnit: this.targets[i].distanceUnit,
          totalTime,
          splitTime,
          pace,
        });
      }

      // Return results array
      return results;
    },
  },

  watch: {
    /**
     * Sort targets
     */
    inEditMode() {
      this.targets = targetUtils.sort(this.targets);
    },

    /**
     * Save targets
     */
    targets: {
      handler(newValue) {
        if (storageKey !== null) {
          storage.set(storageKey, newValue);
        }
      },
      deep: true,
    },
  },

  methods: {
    /**
     * Restore the default targets
     */
    resetTargets() {
      // Clone default targets array
      this.targets = JSON.parse(JSON.stringify(defaultTargets));

      // Sort targets
      this.targets = targetUtils.sort(this.targets);
    },
  },

  /**
   * Close edit targets table
   */
  deactivated() {
    this.inEditMode = false;
  },
};
</script>

<style scoped>
/* container */
.split-calculator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* target table */
.results th:last-child {
  text-align: right;
}
.results th:first-child span.mobile-abbreviation {
  display: none;
}

/* calculator output */
.output {
  min-width: 400px;
}
@media only screen and (max-width: 500px) {
  .output {
    width: 100%;
    min-width: 0px;
  }
  .results th:first-child span:not(.mobile-abbreviation) {
    display: none;
  }
  .results th:first-child span.mobile-abbreviation {
    display: inherit;
  }
}
</style>
