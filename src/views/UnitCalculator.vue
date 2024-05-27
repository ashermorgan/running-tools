<template>
  <div class="unit-calculator">
    <select class="category" v-model="category" aria-label="Selected unit category">
      <option value="distance">Distance</option>
      <option value="time">Time</option>
      <option value="speed_and_pace">Speed &amp; Pace</option>
    </select>

    <time-input v-if="getUnitType(input.inputUnit) === 'time'" class="input-value"
      label="Input time" v-model="input.inputValue"/>
    <decimal-input v-else class="input-value" aria-label="Input value"
      v-model="input.inputValue" :min="0" :digits="2"/>

    <select v-model="input.inputUnit" class="input-units" aria-label="Input units">
      <option v-for="(value, key) in units" :key="key" :value="key">
        {{ value.name }}
      </option>
    </select>

    <span class="equals"> = </span>

    <span v-if="getUnitType(input.outputUnit) === 'time'" class="output-value" aria-label="Output value">
      {{ formatUtils.formatDuration(outputValue, 6, 3, true) }}
    </span>
    <span v-else class="output-value" aria-label="Output value">
      {{ formatUtils.formatNumber(outputValue, 0, 3, true) }}
    </span>

    <select v-model="input.outputUnit" class="output-units" aria-label="Output units">
      <option v-for="(value, key) in units" :key="key" :value="key">
        {{ value.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import formatUtils from '@/utils/format';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

import useStorage from '@/composables/useStorage';

/**
 * The calculator inputs
 */
const inputs = useStorage('unit-calculator-inputs', {
  distance: {
    inputValue: 1,
    inputUnit: 'miles',
    outputUnit: 'kilometers',
  },
  time: {
    inputValue: 1,
    inputUnit: 'seconds',
    outputUnit: 'hh:mm:ss',
  },
  speed_and_pace: {
    inputValue: 600,
    inputUnit: 'seconds_per_mile',
    outputUnit: 'miles_per_hour',
  },
});

/**
 * The unit category
 */
const category = ref('distance');

/**
 * The inputs for the current category
 */
const input = computed({
  get() {
    return inputs.value[category.value];
  },
  set(newValue) {
    inputs.value[category.value] = newValue;
  },
});

/**
 * The names of the units in the current category
 */
const units = computed(() => {
  switch (category.value) {
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
});

/**
 * The output value
 */
const outputValue = computed(() => {
  switch (category.value) {
    case 'distance': {
      return unitUtils.convertDistance(input.value.inputValue, input.value.inputUnit,
      input.value.outputUnit);
    }
    case 'time': {
      // Correct input and output units for 'hh:mm:ss' unit
      const realInput = input.value.inputUnit === 'hh:mm:ss' ? 'seconds' : input.value.inputUnit;
      const realOutput = input.value.outputUnit === 'hh:mm:ss' ? 'seconds' : input.value.outputUnit;

      // Calculate conversion
      return unitUtils.convertTime(input.value.inputValue, realInput, realOutput);
    }
    case 'speed_and_pace': {
      return unitUtils.convertSpeedPace(input.value.inputValue, input.value.inputUnit,
      input.value.outputUnit);
    }
    default: {
      return null;
    }
  }
});

/**
 * Get the type of a unit
 * @param {String} unit The unit
 * @returns {String} The type ('decimal' or 'time')
 */
function getUnitType(unit) {
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
}
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
