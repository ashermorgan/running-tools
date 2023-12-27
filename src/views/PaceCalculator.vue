<template>
  <div class="calculator">
    <h2>Input Pace</h2>
    <div class="input">
      <div>
        Distance:
        <decimal-input v-model="inputDistance" aria-label="distance value"
          :min="0" :digits="2"/>
        <select v-model="inputUnit" aria-label="distance unit">
          <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
            {{ value.name }}
          </option>
        </select>
      </div>
      <div>
        Time:
        <time-input v-model="inputTime"/>
      </div>
    </div>

    <h2>Equivalent Paces</h2>
    <div class="target-set">
      Target Set:
      <target-set-selector v-model="selectedTargetSet" @targets-updated="reloadTargets"/>
    </div>

    <simple-target-table class="output" :calculate-result="calculatePace"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script>
import paceUtils from '@/utils/paces';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';
import TimeInput from '@/components/TimeInput.vue';

import blur from '@/directives/blur';

export default {
  name: 'PaceCalculator',

  components: {
    DecimalInput,
    SimpleTargetTable,
    TargetSetSelector,
    TimeInput,
  },

  directives: {
    blur,
  },

  data() {
    return {
      /**
       * The input distance value
       */
      inputDistance: storage.get('pace-calculator-input-distance', 5),

      /**
       * The input distance unit
       */
      inputUnit: storage.get('pace-calculator-input-unit', 'kilometers'),

      /**
       * The input time value
       */
      inputTime: storage.get('pace-calculator-input-time', 20 * 60),

      /**
       * The names of the distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,

      /**
       * The current selected target set
       */
      selectedTargetSet: storage.get('pace-calculator-target-set', '_pace_targets'),

      /**
       * The target sets
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
     * Save input distance value
     */
    inputDistance(newValue) {
      storage.set('pace-calculator-input-distance', newValue);
    },

    /**
     * Save input distance unit
     */
    inputUnit(newValue) {
      storage.set('pace-calculator-input-unit', newValue);
    },

    /**
     * Save input time value
     */
    inputTime(newValue) {
      storage.set('pace-calculator-input-time', newValue);
    },

    /**
     * Save the current selected target set
     */
    selectedTargetSet(newValue) {
      storage.set('pace-calculator-target-set', newValue);
    },
  },

  computed: {
    /**
     * The input pace (in seconds per meter)
     */
    pace() {
      const distance = unitUtils.convertDistance(this.inputDistance, this.inputUnit, 'meters');
      return paceUtils.getPace(distance, this.inputTime);
    },
  },

  methods: {
    /**
     * Reload the target sets
     */
    reloadTargets() {
      this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
    },

    /**
     * Calculate paces from a target
     * @param {Object} target The target
     * @returns {Object} The result
     */
    calculatePace(target) {
      // Initialize result
      const result = {
        distanceValue: target.distanceValue,
        distanceUnit: target.distanceUnit,
        time: target.time,
        result: target.result,
      };

      // Add missing value to result
      if (target.result === 'time') {
        // Convert target distance into meters
        const d2 = unitUtils.convertDistance(target.distanceValue, target.distanceUnit, 'meters');

        // Calculate time to travel distance at input pace
        const time = paceUtils.getTime(this.pace, d2);

        // Update result
        result.time = time;
      } else {
        // Calculate distance traveled in time at input pace
        let distance = paceUtils.getDistance(this.pace, target.time);

        // Convert output distance into default distance unit
        distance = unitUtils.convertDistance(distance, 'meters', unitUtils.getDefaultDistanceUnit());

        // Update result
        result.distanceValue = distance;
        result.distanceUnit = unitUtils.getDefaultDistanceUnit();
      }

      // Return result
      return result;
    },
  },

  activated() {
    this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
  },
};
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
