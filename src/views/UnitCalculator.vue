<template>
  <div class="unit-calculator">
    <select class="category" v-model="category">
      <option value="distance">Distance</option>
      <option value="time">Time</option>
      <option value="speed_and_pace">Speed & Pace</option>
    </select>

    <time-input v-if="getUnitType(inputUnit) === 'time'" class="input-value"
      v-model="inputValue"/>
    <decimal-input v-else class="input-value" aria-label="input value"
      v-model="inputValue" :min="0" :digits="2"/>

    <select v-model="inputUnit" class="input-units" aria-label="input units">
      <option v-for="(value, key) in unitNames" :key="key" :value="key">
        {{ value }}
      </option>
    </select>

    <span class="equals"> = </span>

    <span v-if="getUnitType(outputUnit) === 'time' "class="output-value">
      {{ formatDuration(outputValue) }}
    </span>
    <span v-else class="output-value">
      {{ outputValue.toFixed(2) }}
    </span>

    <select v-model="outputUnit" class="output-units" aria-label="output units">
      <option v-for="(value, key) in unitNames" :key="key" :value="key">
        {{ value }}
      </option>
    </select>
  </div>
</template>

<script>
import unitUtils from '@/utils/units.js';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'UnitCalculator',

  components: {
    DecimalInput,
    TimeInput,
  },

  data: function() {
    return {
      /**
       * The input value
       */
      inputValue: 1.0,

      /**
       * The unit of the input
       */
      inputUnit: 'miles',

      /**
       * The unit of the output
       */
      outputUnit: 'meters',

      /**
       * The unit category
       */
      category: 'distance',

      /**
       * The formatDuration method
       */
      formatDuration: unitUtils.formatDuration,
    };
  },

  computed: {
    /**
     * The names of the units in the current category
     */
    unitNames: function() {
      if (this.category === 'distance') {
        return unitUtils.DISTANCE_UNIT_NAMES;
      }
      else if (this.category === 'time') {
        return {...unitUtils.TIME_UNIT_NAMES, 'hh:mm:ss': 'hh:mm:ss'};
      }
      else if (this.category === 'speed_and_pace') {
        return {...unitUtils.PACE_UNIT_NAMES, ...unitUtils.SPEED_UNIT_NAMES};
      }
    },

    /**
     * The output value
     */
    outputValue: function() {
      if (this.category === 'distance') {
        return unitUtils.convertDistance(this.inputValue, this.inputUnit,
          this.outputUnit);
      }
      else if (this.category === 'time') {
        // Correct input and output units for 'hh:mm:ss' unit
        let realInput, realOutput;
        if (this.inputUnit === 'hh:mm:ss') {
          realInput = unitUtils.TIME_UNITS.seconds;
        }
        else {
          realInput = this.inputUnit;
        }
        if (this.outputUnit === 'hh:mm:ss') {
          realOutput = unitUtils.TIME_UNITS.seconds;
        }
        else {
          realOutput = this.outputUnit;
        }

        // Calculate conversion
        return unitUtils.convertTime(this.inputValue, realInput, realOutput);
      }
      else if (this.category === 'speed_and_pace') {
        return unitUtils.convertSpeedPace(this.inputValue, this.inputUnit,
          this.outputUnit);
      }
    },
  },

  watch: {
    /**
     * Reset inputValue, inputUnit, and outputUnit
     */
    category: function(newValue) {
      if (newValue === 'distance') {
        this.inputValue = 1;
        this.inputUnit = 'miles';
        this.outputUnit = 'meters';
      }
      else if (newValue === 'time') {
        this.inputValue = 1;
        this.inputUnit = 'seconds';
        this.outputUnit = 'hh:mm:ss';
      }
      else if (newValue === 'speed_and_pace') {
        this.inputValue = 1;
        this.inputUnit = 'miles_per_hour';
        this.outputUnit = 'seconds_per_mile';
      }
    },
  },

  methods: {
    /**
     * Get the type of a unit
     * @param {String} unit The unit
     * @returns {String} The type ('decimal' or 'time')
     */
    getUnitType: function(unit) {
      if (unit in unitUtils.DISTANCE_UNITS) {
        return 'decimal';
      }
      else if (unit in unitUtils.TIME_UNITS) {
        return 'decimal';
      }
      else if (unit === 'hh:mm:ss') {
        return 'time';
      }
      else if (['seconds_per_kilometer', 'seconds_per_mile'].includes(unit)) {
        return 'time';
      }
      else {
        return 'decimal';
      }
    },
  },
};
</script>

<style scoped>
.unit-calculator {
  margin: 0px auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto auto;
  width: 450px;
  grid-gap: 0.4em;
}
.unit-calculator .category {
  grid-row: 1;
  grid-column: 1 / 4;
}
.unit-calculator .input-value {
  grid-row: 2;
  grid-column: 1;

  width: 100%;
  text-align: center;
}
.unit-calculator .input-units {
  grid-row: 3;
  grid-column: 1;
}
.unit-calculator .equals {
  grid-row: 2 / 4;
  grid-column: 2;

  text-align: center;
  padding: 0em 0.5em;
  font-size: 2em;
}
.unit-calculator .output-value {
  grid-row: 2;
  grid-column: 3;

  width: 100%;
  text-align: center;
}
.unit-calculator .output-units {
  grid-row: 3;
  grid-column: 3;
}

@media only screen and (max-width: 500px) {
  /* switch to mobile friendly layout */
  .unit-calculator {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto auto auto;
    width: 100%;
  }
  .unit-calculator * {
    grid-column: 1 !important;
  }
  .unit-calculator .category {
    grid-row: 1;
  }
  .unit-calculator .input-value {
    grid-row: 2;
  }
  .unit-calculator .input-units {
    grid-row: 3;
  }
  .unit-calculator .equals {
    grid-row: 4;
  }
  .unit-calculator .output-value {
    grid-row: 5;
  }
  .unit-calculator .output-units {
    grid-row: 6;
  }
}
</style>
