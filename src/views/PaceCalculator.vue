<template>
  <div class="pace-calculator">
    <div class="input">
      Running
      <decimal-input v-model="inputDistance" aria-label="distance value"
        :min="0" :digits="2"/>
      <select v-model="inputUnit" aria-label="distance unit">
        <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
          {{ value.name }}
        </option>
      </select>
      in
      <time-input v-model="inputTime"/>
    </div>

    <p>is the same pace as running</p>

    <target-table class="output" :calculate-result="calculatePace" :default-targets="defaultTargets"
      storage-key="pace-calculator-targets"/>
  </div>
</template>

<script>
import paceUtils from '@/utils/paces';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import TargetTable from '@/components/TargetTable.vue';

export default {
  name: 'PaceCalculator',

  components: {
    DecimalInput,
    TimeInput,
    TargetTable,
  },

  data() {
    return {
      /**
       * The input distance value
       */
      inputDistance: 1,

      /**
       * The input distance unit
       */
      inputUnit: 'miles',

      /**
       * The input time value
       */
      inputTime: 8 * 60,

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
        { result: 'time', distanceValue: 15, distanceUnit: 'kilometers' },

        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 5, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 6, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 8, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 10, distanceUnit: 'miles' },

        { result: 'time', distanceValue: 0.5, distanceUnit: 'marathons' },
        { result: 'time', distanceValue: 1, distanceUnit: 'marathons' },

        { result: 'distance', distanceUnit: 'miles', time: 600 },
        { result: 'distance', distanceUnit: 'miles', time: 1800 },
        { result: 'distance', distanceUnit: 'miles', time: 3600 },
      ],
    };
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

        // Convert output distance into miles
        distance = unitUtils.convertDistance(distance, 'meters', 'miles');

        // Update result
        result.distanceValue = distance;
        result.distanceUnit = 'miles';
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

/* calculator input */
.input {
  text-align: center;
  margin-bottom: 5px;
}
.input>* {
  margin-bottom: 5px;  /* adds space between wrapped lines */
}
.input select {
  margin-left: 5px;
}

/* calculator output */
.output {
  margin-top: 10px;
  min-width: 300px;
}
@media only screen and (max-width: 500px) {
  .output {
    width: 100%;
    min-width: 0px;
  }
}
</style>
