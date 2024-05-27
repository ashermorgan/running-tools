<template>
  <div class="pace-input">
    <div>
      Distance:
      <decimal-input v-model="model.distanceValue"
        :aria-label="label + ' distance value'" :min="0" :digits="2"/>
      <select v-model="model.distanceUnit" :aria-label="label + ' distance unit'">
        <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
          {{ value.name }}
        </option>
      </select>
    </div>
    <div>
      Time:
      <time-input v-model="model.time" :label="label + ' duration'"/>
    </div>
  </div>
</template>

<script setup>
import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

import unitUtils from '@/utils/units';
const distanceUnits = unitUtils.DISTANCE_UNITS;

/**
 * The component value
 */
const model = defineModel({
  type: Object,
  default: {
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  },
});

defineProps({
  /**
   * The prefix for each field's aria-label
   */
  label: {
    type: String,
    default: 'Input',
  },
});

</script>

<style scoped>
.pace-input div + div {
  margin-top: 5px;
}
.pace-input select {
  margin-left: 5px;
}
</style>
