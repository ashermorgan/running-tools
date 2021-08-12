<template>
  <div class="calc-pace">
    <div class="input">
      Running
      <decimal-input v-model="inputDistance" :min="0" :digits="2"/>
      <select v-model="inputUnit">
        <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
          {{ value }}(s)
        </option>
      </select>
      in
      <time-input v-model="inputTime"/>
    </div>

    <p>is the same pace as running</p>

    <table class="output">
      <thead>
        <tr>
          <th>Distance</th>
          <th></th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in results" :key="index">
          <td>
            {{ item.distanceValue.toFixed(2) }}
            {{ distanceSymbols[item.distanceUnit] }}
          </td>

          <td>in</td>

          <td class="output-value">
            {{ formatDuration(item.time, 0, 2) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import paceUtils from '@/utils/paces.js';
import unitUtils from '@/utils/units.js';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'Home',

  components: {
    DecimalInput,
    TimeInput,
  },

  data: function() {
    return {
      /**
       * The input distance value
       */
      inputDistance: 1,

      /**
       * The input distance unit
       */
      inputUnit: 'mile',

      /**
       * The input time value
       */
      inputTime: 10 * 60,

      /**
       * The names of the distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNIT_NAMES,

      /**
       * The symbols of the distance units
       */
      distanceSymbols: unitUtils.DISTANCE_UNIT_SYMBOLS,

      /**
       * The formatDuration method
       */
      formatDuration: unitUtils.formatDuration,

      /**
       * The output targets
       */
      targets: [
        { distanceValue: 100,   distanceUnit: 'meter' },
        { distanceValue: 200,   distanceUnit: 'meter' },
        { distanceValue: 300,   distanceUnit: 'meter' },
        { distanceValue: 400,   distanceUnit: 'meter' },
        { distanceValue: 600,   distanceUnit: 'meter' },
        { distanceValue: 800,   distanceUnit: 'meter' },
        { distanceValue: 1000,  distanceUnit: 'meter' },
        { distanceValue: 1200,  distanceUnit: 'meter' },
        { distanceValue: 1500,  distanceUnit: 'meter' },
        { distanceValue: 1600,  distanceUnit: 'meter' },
        { distanceValue: 3200,  distanceUnit: 'meter' },

        { distanceValue: 1,     distanceUnit: 'mile' },
        { distanceValue: 2,     distanceUnit: 'mile' },
        { distanceValue: 3,     distanceUnit: 'mile' },
        { distanceValue: 5,     distanceUnit: 'mile' },
        { distanceValue: 10,    distanceUnit: 'mile' },

        { distanceValue: 2,     distanceUnit: 'kilometer' },
        { distanceValue: 3,     distanceUnit: 'kilometer' },
        { distanceValue: 4,     distanceUnit: 'kilometer' },
        { distanceValue: 5,     distanceUnit: 'kilometer' },
        { distanceValue: 6,     distanceUnit: 'kilometer' },
        { distanceValue: 8,     distanceUnit: 'kilometer' },
        { distanceValue: 10,    distanceUnit: 'kilometer' },
        { distanceValue: 15,    distanceUnit: 'kilometer' },

        { distanceValue: 0.5,   distanceUnit: 'marathon' },
        { distanceValue: 1,     distanceUnit: 'marathon' },
      ],
    };
  },

  computed: {
    /**
     * The input pace (in seconds per meter)
     */
    pace: function() {
      let distance = unitUtils.convertDistance(this.inputDistance,
        this.inputUnit, unitUtils.DISTANCE_UNITS.meter);
      return paceUtils.getPace(distance, this.inputTime);
    },

    /**
     * The output results
     */
    results: function() {
      // Calculate results
      let result = [];
      for (let row of this.targets) {
        // Convert distance into meters
        let distance = unitUtils.convertDistance(row.distanceValue,
          row.distanceUnit, unitUtils.DISTANCE_UNITS.meter);

        // Calculate time to travel distance at input pace
        let time = paceUtils.getTime(this.pace, distance);

        // Add result
        result.push({
          distanceValue: row.distanceValue,
          distanceUnit: row.distanceUnit,
          time: time,
        });
      }

      // Sort results by time
      result.sort(function(a, b){return a.time-b.time});

      // Return results
      return result;
    },
  },
}
</script>

<style>
/* container */
.calc-pace {
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
table {
  margin-top: 10px;
  border-collapse: collapse;
  min-width: 300px;
}
tr {
  border: 1px solid #000000;
}
th, td {
  padding: 0.2em;
  text-align: left;
}
.output-value {
  font-weight: bold;
}
@media only screen and (max-width: 400px) {
  table {
    width: 100%;
  }
}
</style>
