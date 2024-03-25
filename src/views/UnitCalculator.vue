<template>
  <div class="unit-calculator">
    <select class="category" v-model="category" aria-label="Selected unit category">
      <option value="distance">Distance</option>
      <option value="time">Time</option>
      <option value="speed_and_pace">Speed &amp; Pace</option>
    </select>

    <time-input v-if="getUnitType(inputUnit) === 'time'" class="input-value"
      label="Input time" v-model="inputValue"/>
    <decimal-input v-else class="input-value" aria-label="Input value"
      v-model="inputValue" :min="0" :digits="2"/>

    <select v-model="inputUnit" class="input-units" aria-label="Input units">
      <option v-for="(value, key) in units" :key="key" :value="key">
        {{ value.name }}
      </option>
    </select>

    <span class="equals"> = </span>

    <span v-if="getUnitType(outputUnit) === 'time'" class="output-value" aria-label="Output value">
      {{ formatDuration(outputValue, 6, 3, true) }}
    </span>
    <span v-else class="output-value" aria-label="Output value">
      {{ formatNumber(outputValue, 0, 3, true) }}
    </span>

    <select v-model="outputUnit" class="output-units" aria-label="Output units">
      <option v-for="(value, key) in units" :key="key" :value="key">
        {{ value.name }}
      </option>
    </select>
  </div>
</template>

<script>
import formatUtils from '@/utils/format';
import storage from '@/utils/localStorage';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'UnitCalculator',

  components: {
    DecimalInput,
    TimeInput,
  },

  data() {
    return {
      /**
       * The input value
       */
      inputValue: storage.get('unit-calculator-distance-input-value', 1.0),

      /**
       * The unit of the input
       */
      inputUnit: storage.get('unit-calculator-distance-input-unit', 'miles'),

      /**
       * The unit of the output
       */
      outputUnit: storage.get('unit-calculator-distance-output-unit', 'kilometers'),

      /**
       * The unit category
       */
      category: 'distance',

      /**
       * The formatDuration method
       */
      formatDuration: formatUtils.formatDuration,

      /**
       * The formatNumber method
       */
      formatNumber: formatUtils.formatNumber,
    };
  },

  computed: {
    /**
     * The names of the units in the current category
     */
    units() {
      switch (this.category) {
        case 'distance': {
          return unitUtils.DISTANCE_UNITS;
        }
        case 'time': {
          return {
            ...unitUtils.TIME_UNITS,
            'hh:mm:ss': {
              name: 'hh:mm:ss',
              symbol: '',
              value: null,
            },
          };
        }
        case 'speed_and_pace': {
          return { ...unitUtils.PACE_UNITS, ...unitUtils.SPEED_UNITS };
        }
        default: {
          return {};
        }
      }
    },

    /**
     * The output value
     */
    outputValue() {
      switch (this.category) {
        case 'distance': {
          return unitUtils.convertDistance(this.inputValue, this.inputUnit, this.outputUnit);
        }
        case 'time': {
          // Correct input and output units for 'hh:mm:ss' unit
          const realInput = this.inputUnit === 'hh:mm:ss' ? 'seconds' : this.inputUnit;
          const realOutput = this.outputUnit === 'hh:mm:ss' ? 'seconds' : this.outputUnit;

          // Calculate conversion
          return unitUtils.convertTime(this.inputValue, realInput, realOutput);
        }
        case 'speed_and_pace': {
          return unitUtils.convertSpeedPace(this.inputValue, this.inputUnit, this.outputUnit);
        }
        default: {
          return null;
        }
      }
    },
  },

  watch: {
    /**
     * Reset inputValue, inputUnit, and outputUnit
     */
    category(newValue) {
      switch (newValue) {
        case 'distance': {
          this.inputValue = storage.get('unit-calculator-distance-input-value', 1);
          this.inputUnit = storage.get('unit-calculator-distance-input-unit', 'miles');
          this.outputUnit = storage.get('unit-calculator-distance-output-unit', 'kilometers');
          break;
        }
        case 'time': {
          this.inputValue = storage.get('unit-calculator-time-input-value', 1);
          this.inputUnit = storage.get('unit-calculator-time-input-unit', 'seconds');
          this.outputUnit = storage.get('unit-calculator-time-output-unit', 'hh:mm:ss');
          break;
        }
        case 'speed_and_pace': {
          this.inputValue = storage.get('unit-calculator-speed-input-value', 600);
          this.inputUnit = storage.get('unit-calculator-speed-input-unit',
            'seconds_per_mile');
          this.outputUnit = storage.get('unit-calculator-speed-output-unit',
            'miles_per_hour');
          break;
        }
        default: {
          break;
        }
      }
    },

    /**
     * Save input value
     */
    inputValue(newValue) {
      switch (this.category) {
        case 'distance': {
          storage.set('unit-calculator-distance-input-value', newValue);
          break;
        }
        case 'time': {
          storage.set('unit-calculator-time-input-value', newValue);
          break;
        }
        case 'speed_and_pace': {
          storage.set('unit-calculator-speed-input-value', newValue);
          break;
        }
        default: {
          break;
        }
      }
    },

    /**
     * Save input unit
     */
    inputUnit(newValue) {
      switch (this.category) {
        case 'distance': {
          storage.set('unit-calculator-distance-input-unit', newValue);
          break;
        }
        case 'time': {
          storage.set('unit-calculator-time-input-unit', newValue);
          break;
        }
        case 'speed_and_pace': {
          storage.set('unit-calculator-speed-input-unit', newValue);
          break;
        }
        default: {
          break;
        }
      }
    },

    /**
     * Save output unit
     */
    outputUnit(newValue) {
      switch (this.category) {
        case 'distance': {
          storage.set('unit-calculator-distance-output-unit', newValue);
          break;
        }
        case 'time': {
          storage.set('unit-calculator-time-output-unit', newValue);
          break;
        }
        case 'speed_and_pace': {
          storage.set('unit-calculator-speed-output-unit', newValue);
          break;
        }
        default: {
          break;
        }
      }
    },
  },

  methods: {
    /**
     * Get the type of a unit
     * @param {String} unit The unit
     * @returns {String} The type ('decimal' or 'time')
     */
    getUnitType(unit) {
      if (unit in unitUtils.DISTANCE_UNITS) {
        return 'decimal';
      }
      if (unit in unitUtils.TIME_UNITS) {
        return 'decimal';
      }
      if (unit === 'hh:mm:ss') {
        return 'time';
      }
      if (['seconds_per_kilometer', 'seconds_per_mile'].includes(unit)) {
        return 'time';
      }
      return 'decimal';
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
