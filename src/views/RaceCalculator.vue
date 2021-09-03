<template>
  <div class="race-calculator">
    <div class="input">
      Running
      <decimal-input v-model="inputDistance" aria-label="Distance value" :min="0" :digits="2"/>
      <select v-model="inputUnit" aria-label="Distance unit">
        <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
          {{ value }}
        </option>
      </select>
      in
      <time-input v-model="inputTime"/>
    </div>

    <p>is approximately equivalent to running</p>

    <time-table class="output" :calculate-result="predictTime" :default-targets="defaultTargets"
      storage-key="race-calculator-targets"/>
  </div>
</template>

<script>
import raceUtils from '@/utils/races';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import TimeTable from '@/components/TimeTable.vue';

export default {
  name: 'RaceCalculator',

  components: {
    DecimalInput,
    TimeInput,
    TimeTable,
  },

  data() {
    return {
      /**
       * The input distance value
       */
      inputDistance: 5,

      /**
       * The input distance unit
       */
      inputUnit: 'kilometers',

      /**
       * The input time value
       */
      inputTime: 20 * 60,

      /**
       * The names of the distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNIT_NAMES,

      /**
       * The default output targets
       */
      defaultTargets: [
        { distanceValue: 400, distanceUnit: 'meters' },
        { distanceValue: 800, distanceUnit: 'meters' },
        { distanceValue: 1000, distanceUnit: 'meters' },
        { distanceValue: 1200, distanceUnit: 'meters' },
        { distanceValue: 1500, distanceUnit: 'meters' },
        { distanceValue: 1600, distanceUnit: 'meters' },
        { distanceValue: 3200, distanceUnit: 'meters' },

        { distanceValue: 3, distanceUnit: 'kilometers' },
        { distanceValue: 5, distanceUnit: 'kilometers' },
        { distanceValue: 8, distanceUnit: 'kilometers' },
        { distanceValue: 10, distanceUnit: 'kilometers' },
        { distanceValue: 15, distanceUnit: 'kilometers' },

        { distanceValue: 1, distanceUnit: 'miles' },
        { distanceValue: 2, distanceUnit: 'miles' },
        { distanceValue: 3, distanceUnit: 'miles' },
        { distanceValue: 5, distanceUnit: 'miles' },
        { distanceValue: 10, distanceUnit: 'miles' },

        { distanceValue: 0.5, distanceUnit: 'marathons' },
        { distanceValue: 1, distanceUnit: 'marathons' },
      ],
    };
  },

  methods: {
    /**
     * Predict race times from a target
     * @param {Object} target The target
     * @returns {Object} The result
     */
    predictTime(target) {
      // Convert distances into meters
      const d1 = unitUtils.convertDistance(this.inputDistance, this.inputUnit,
        unitUtils.DISTANCE_UNITS.meters);
      const d2 = unitUtils.convertDistance(target.distanceValue, target.distanceUnit,
        unitUtils.DISTANCE_UNITS.meters);

      // Get prediction
      const time = raceUtils.AverageModel.predictTime(d1, this.inputTime, d2);

      // Return result
      return {
        distanceValue: target.distanceValue,
        distanceUnit: target.distanceUnit,
        time,
      };
    },
  },
};
</script>

<style scoped>
/* container */
.race-calculator {
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
