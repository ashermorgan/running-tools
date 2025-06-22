<template>
  <div class="pace-input">
    <div>
      Distance:
      <decimal-input v-model="model.distanceValue"
        :aria-label="label + ' distance value'" :min="0" :digits="2"/>
      <select v-model="model.distanceUnit" :aria-label="label + ' distance unit'">
        <option v-for="key in DISTANCE_UNIT_KEYS" :key="key" :value="key">
        {{ DISTANCE_UNITS[key].name }}
        </option>
      </select>
    </div>
    <div>
      Time:
      <time-input v-model="model.time" :label="label + ' duration'"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import { DISTANCE_UNITS, DISTANCE_UNIT_KEYS } from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import useObjectModel from '@/composables/useObjectModel';

interface Pace {
  distanceValue: number,
  distanceUnit: DISTANCE_UNIT_KEYS,
  time: number,
};

const props = defineProps({
  /**
   * The prefix for each field's aria-label
   */
  label: {
    type: String,
    default: 'Input',
  },

  /**
   * The component value
   */
  modelValue: {
    type: Object as PropType<Pace>,
    default: () => ({
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    }),
  },
});

// Generate internal ref tied to modelValue prop
const emit = defineEmits(['update:modelValue']);
const model = useObjectModel<Pace>(() => props.modelValue, (x) => emit('update:modelValue', x));
</script>

<style scoped>
.pace-input div + div {
  margin-top: 5px;
}
.pace-input select {
  margin-left: 5px;
}
</style>
