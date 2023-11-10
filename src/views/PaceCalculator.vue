<template>
  <div class="pace-calculator">
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
    <div class="output">
      <target-editor v-show="editingTargetSets" v-model="targetSets[selectedTargetSet]"
        @close="editingTargetSets = false" @reset="resetTargetSet"/>
      <button v-show="!editingTargetSets" title="Edit Target Sets" @click="editingTargetSets = true" v-blur>
        Edit Target Set
      </button>
      <simple-target-table v-show="!editingTargetSets" :calculate-result="calculatePace"
       :targets="targetSets[selectedTargetSet].targets"/>
    </div>
  </div>
</template>

<script>
import VueFeather from 'vue-feather';

import paceUtils from '@/utils/paces';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';
import TargetEditor from '@/components/TargetEditor.vue';
import TimeInput from '@/components/TimeInput.vue';

import blur from '@/directives/blur';

export default {
  name: 'PaceCalculator',

  components: {
    DecimalInput,
    SimpleTargetTable,
    TargetEditor,
    TimeInput,
    VueFeather,
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
      selectedTargetSet: '_pace_targets',

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
     * Save the target sets
     */
    targetSets: {
      deep: true,
      handler(newValue) {
        storage.set('target-sets', newValue);
      },
    },

    /**
     * Sort target set
     */
    editingTargetSets() {
      this.targetSets[this.selectedTargetSet].targets =
        targetUtils.sort(this.targetSets[this.selectedTargetSet].targets);
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
     * Restore the default target set
     */
    resetTargetSet() {
      this.targetSets[this.selectedTargetSet] =
        JSON.parse(JSON.stringify(targetUtils.defaultTargetSets[this.selectedTargetSet]));
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
    this.editingTargetSets = false;
    this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
  },
};
</script>

<style scoped>
/* container */
.pace-calculator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* headings */
h2 {
  font-size: 1.3em;
  margin-bottom: 0.2em;
}
* + h2 {
  margin-top: 0.5em;
}

/* calculator input */
.input>* {
  margin-bottom: 5px;  /* adds space between wrapped lines */
}
.input select {
  margin-left: 5px;
}

/* calculator output */
.output {
  min-width: 300px;
}
.output>* {
  margin-bottom: 5px;
}
@media only screen and (max-width: 500px) {
  .output {
    width: 100%;
    min-width: 0px;
  }
}
</style>
