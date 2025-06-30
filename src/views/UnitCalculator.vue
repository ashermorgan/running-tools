<template>
  <div class="unit-calculator">
    <select class="category" v-model="category" aria-label="Selected unit category">
      <option value="distance">Distance</option>
      <option value="time">Time</option>
      <option value="speed_and_pace">Speed &amp; Pace</option>
    </select>

    <time-input v-if="isTimeUnit(input.inputUnit)" class="input-value"
      label="Input time" v-model="input.inputValue"/>
    <decimal-input v-else class="input-value" aria-label="Input value"
      v-model="input.inputValue" :min="0" :digits="2"/>

    <select v-model="input.inputUnit" class="input-units" aria-label="Input units">
      <option v-for="(value, key) in units" :key="key" :value="key">
        {{ value?.name }}
      </option>
    </select>

    <span class="equals"> = </span>

    <span v-if="isTimeUnit(input.outputUnit)" class="output-value" aria-label="Output value">
      {{ formatDuration(outputValue, 6, 3, true) }}
    </span>
    <span v-else class="output-value" aria-label="Output value">
      {{ formatNumber(outputValue, 0, 3, true) }}
    </span>

    <select v-model="input.outputUnit" class="output-units" aria-label="Output units">
      <option v-for="(value, key) in units" :key="key" :value="key">
        {{ value?.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { formatDuration, formatNumber } from '@/utils/format';
import * as unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

import useStorage from '@/composables/useStorage';

/*
 * The three categories of units
 */
enum UnitTypes {
  Distance = 'distance',
  Time = 'time',
  SpeedPace = 'speed_and_pace',
}

/*
 * The supported time units: Hours, Minutes, Seconds, and 'hh:mm:ss'
 */
type ExtendedTimeUnits = unitUtils.TimeUnits | 'hh:mm:ss';

/*
 * The support units from all categories
 */
type AllUnits = unitUtils.DistanceUnits | ExtendedTimeUnits | unitUtils.SpeedPaceUnits;

/*
 * The type of the calculator inputs
 */
interface UnitCalculatorInputs {
  [UnitTypes.Distance]: {
    inputValue: number,
    inputUnit: unitUtils.DistanceUnits,
    outputUnit: unitUtils.DistanceUnits,
  },
  [UnitTypes.Time]: {
    inputValue: number,
    inputUnit: ExtendedTimeUnits,
    outputUnit: ExtendedTimeUnits,
  },
  [UnitTypes.SpeedPace]: {
    inputValue: number,
    inputUnit: unitUtils.SpeedPaceUnits,
    outputUnit: unitUtils.SpeedPaceUnits,
  },
};

/*
 * The calculator inputs
 */
const inputs = useStorage<UnitCalculatorInputs>('unit-calculator-inputs', {
  [UnitTypes.Distance]: {
    inputValue: 1,
    inputUnit: unitUtils.DistanceUnits.Miles,
    outputUnit: unitUtils.DistanceUnits.Kilometers,
  },
  [UnitTypes.Time]: {
    inputValue: 1,
    inputUnit: unitUtils.TimeUnits.Seconds,
    outputUnit: 'hh:mm:ss',
  },
  [UnitTypes.SpeedPace]: {
    inputValue: 600,
    inputUnit: unitUtils.PaceUnits.TimePerMile,
    outputUnit: unitUtils.SpeedUnits.MilesPerHour,
  },
});

/*
 * The unit category
 */
const category = useStorage<UnitTypes>('unit-calculator-category', UnitTypes.Distance);

/*
 * The inputs for the current category
 */
const input = computed<{ inputValue: number, inputUnit: AllUnits, outputUnit: AllUnits }>({
  get() {
    return inputs.value[category.value];
  },
  set(newValue) {
    switch (category.value) {
      default:
      case UnitTypes.Distance: {
        inputs.value[category.value] = {
          inputValue: newValue.inputValue,
          inputUnit: newValue.inputUnit as unitUtils.DistanceUnits,
          outputUnit: newValue.outputUnit as unitUtils.DistanceUnits,
        };
        break;
      }
      case UnitTypes.Time: {
        inputs.value[category.value] = {
          inputValue: newValue.inputValue,
          inputUnit: newValue.inputUnit as ExtendedTimeUnits,
          outputUnit: newValue.outputUnit as ExtendedTimeUnits,
        };
        break;
      }
      case UnitTypes.SpeedPace: {
        inputs.value[category.value] = {
          inputValue: newValue.inputValue,
          inputUnit: newValue.inputUnit as unitUtils.SpeedPaceUnits,
          outputUnit: newValue.outputUnit as unitUtils.SpeedPaceUnits,
        };
        break;
      }
    }
  },
});

/*
 * The data for the units in the current category
 */
const units = computed<{ [key in AllUnits]?: unitUtils.UnitData }>(() => {
  switch (category.value) {
    default:
    case UnitTypes.Distance: {
      return unitUtils.DistanceUnitData;
    }
    case UnitTypes.Time: {
      return {
        ...unitUtils.TimeUnitData,
        'hh:mm:ss': {
          name: 'hh:mm:ss',
          symbol: '',
          value: 1,
        },
      };
    }
    case UnitTypes.SpeedPace: {
      return { ...unitUtils.PaceUnitData, ...unitUtils.SpeedUnitData };
    }
  }
});

/*
 * The output value
 */
const outputValue = computed<number>(() => {
  switch (category.value) {
    default:
    case UnitTypes.Distance: {
      return unitUtils.convertDistance(input.value.inputValue,
        input.value.inputUnit as unitUtils.DistanceUnits,
        input.value.outputUnit as unitUtils.DistanceUnits);
    }
    case UnitTypes.Time: {
      // Correct input and output units for 'hh:mm:ss' unit
      const realInput = input.value.inputUnit === 'hh:mm:ss' ? 'seconds' : input.value.inputUnit;
      const realOutput = input.value.outputUnit === 'hh:mm:ss' ? 'seconds' : input.value.outputUnit;

      // Calculate conversion
      return unitUtils.convertTime(input.value.inputValue, realInput as unitUtils.TimeUnits,
        realOutput as unitUtils.TimeUnits);
    }
    case UnitTypes.SpeedPace: {
      return unitUtils.convertSpeedPace(input.value.inputValue,
        input.value.inputUnit as unitUtils.SpeedPaceUnits,
        input.value.outputUnit as unitUtils.SpeedPaceUnits);
    }
  }
});

/**
 * Determine whether a unit should be represented as a time
 * @param {AllUnits} unit The unit
 * @returns {boolean} Whether the unit should be represented as a time
 */
function isTimeUnit(unit: AllUnits): boolean {
  return unit in unitUtils.PaceUnitData || unit === 'hh:mm:ss';
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
