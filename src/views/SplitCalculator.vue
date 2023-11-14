<template>
  <div class="calculator">
    <div class="target-set">
      Target Set:
      <select v-model="selectedTargetSet">
        <option v-for="(item, index) in targetSets" :key="index" :value="index">
          {{ item.name }}
        </option>
      </select>
      <button class="icon" title="Edit Target Sets" @click="editingTargetSets = true" v-blur>
        <vue-feather type="edit"/>
      </button>
    </div>

    <div class="output">
      <table class="results">
        <thead>
          <tr>
            <th>
              <span>Distance</span>
              <span class="mobile-abbreviation">Dist</span>
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
              {{ distanceUnits[item.distanceUnit].symbol }}
            </td>

            <td>
              {{ formatDuration(item.totalTime, 3, 2, true) }}
            </td>

            <td v-if="targetSets[selectedTargetSet]">
              <time-input v-model="targetSets[selectedTargetSet].targets[index].split" :showHours="false"/>
            </td>

            <td>
              {{ formatDuration(item.pace, 3, 0, true) }}
              / {{ distanceUnits[getDefaultDistanceUnit()].symbol }}
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

    <Modal v-show="editingTargetSets">
      <target-set-editor @close="editingTargetSets = false"/>
    </Modal>
  </div>
</template>

<script>
import VueFeather from 'vue-feather';

import formatUtils from '@/utils/format';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import Modal from '@/components/Modal.vue';
import TargetSetEditor from '@/components/TargetSetEditor.vue';
import TimeInput from '@/components/TimeInput.vue';

import blur from '@/directives/blur';

export default {
  name: 'SplitCalculator',

  components: {
    Modal,
    TargetSetEditor,
    TimeInput,
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
       * The current selected target set
       */
      selectedTargetSet: storage.get('split-calculator-target-set', '_split_targets'),

      /**
       * The default output targets
       */
      targetSets: storage.get('target-sets', targetUtils.defaultTargetSets),

      /**
       * Whether the target set is being edited
       */
      editingTargetSets: false,
    };
  },

  watch: {
    /**
     * Save the current selected target set
     */
    selectedTargetSet(newValue) {
      storage.set('split-calculator-target-set', newValue);
    },

    /**
     * Refresh the target sets
     */
    editingTargetSets(newValue) {
      if (!newValue) {
        this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
      }
    }
  },

  computed: {
    /**
     * The target table results
     */
    results() {
      // Initialize results array
      const results = [];

      // Check for missing target set
      if (!this.targetSets[this.selectedTargetSet]) return [];

      for (let i = 0; i < this.targetSets[this.selectedTargetSet].targets.length; i += 1) {
        if (this.targetSets[this.selectedTargetSet].targets[i].result === 'time') {
          // Calculate split and total times
          const splitTime = this.targetSets[this.selectedTargetSet].targets[i].split || 0;
          const totalTime = i === 0 ? splitTime : results[i - 1].totalTime + splitTime;

          // Calculate split and total distances
          const totalDistance = unitUtils.convertDistance(
            this.targetSets[this.selectedTargetSet].targets[i].distanceValue,
            this.targetSets[this.selectedTargetSet].targets[i].distanceUnit, 'meters',
          );
          const splitDistance = i === 0 ? totalDistance : totalDistance - results[i - 1].distance;

          // Calculate pace
          const pace = splitTime / unitUtils.convertDistance(splitDistance, 'meters',
            unitUtils.getDefaultDistanceUnit());

          // Add row to results array
          results.push({
            distance: totalDistance,
            distanceValue: this.targetSets[this.selectedTargetSet].targets[i].distanceValue,
            distanceUnit: this.targetSets[this.selectedTargetSet].targets[i].distanceUnit,
            totalTime,
            splitTime,
            pace,
          });
        }
      }

      // Return results array
      return results;
    },
  },

  methods: {
    /**
     * Restore the default target set
     */
    resetTargetSet() {
      this.targetSets[this.selectedTargetSet] =
        JSON.parse(JSON.stringify(targetUtils.defaultTargetSets[this.selectedTargetSet]));
    },
  },

  activated() {
    this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
  },
};
</script>

<style scoped>
@import '@/assets/target-calculator.css';

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
