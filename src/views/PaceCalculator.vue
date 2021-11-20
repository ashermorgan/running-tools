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

    <simple-target-table class="output" :calculate-result="calculatePace"
      :default-targets="defaultTargets" storage-key="pace-calculator-targets-v2"/>
  </div>
</template>

<script>
import paceUtils from '@/utils/paces';
import storage from '@/utils/localStorage';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';

export default {
  name: 'PaceCalculator',

  components: {
    DecimalInput,
    TimeInput,
    SimpleTargetTable,
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
       * The default output targets
       */
      defaultTargets: [
        { result: 'time', distanceValue: 100, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 200, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 300, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 400, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 600, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 800, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1000, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1200, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1500, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1600, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 3200, distanceUnit: 'meters' },

        { result: 'time', distanceValue: 2, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 3, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 4, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 6, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 8, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },

        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 5, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 6, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 8, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 10, distanceUnit: 'miles' },

        { result: 'time', distanceValue: 0.5, distanceUnit: 'marathons' },
        { result: 'time', distanceValue: 1, distanceUnit: 'marathons' },

        { result: 'distance', time: 600 },
        { result: 'distance', time: 1800 },
        { result: 'distance', time: 3600 },
      ],
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
@media only screen and (max-width: 500px) {
  .output {
    width: 100%;
    min-width: 0px;
  }
}
</style>
