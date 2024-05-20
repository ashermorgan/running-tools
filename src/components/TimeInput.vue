<template>
  <div class="time-input">
    <integer-input class="hours" :aria-label="label + ' hours'" v-if="showHours"
      :min="0" :max="99" :padding="1" v-model="hours" @keydown="onkeydown($event, 3600)"/>
    <span v-if="showHours">:</span>
    <integer-input class="minutes" :aria-label="label + ' minutes'"
      :min="0" :max="59" :padding="2" v-model="minutes"
      @keydown="onkeydown($event, 60)"/>
    <span>:</span>
    <decimal-input class="seconds" :aria-label="label + ' seconds'"
      :min="0" :max="59.99" :padding="2" :digits="2" v-model="seconds"
      @keydown="onkeydown($event, 1)"/>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

import IntegerInput from '@/components/IntegerInput.vue';
import DecimalInput from '@/components/DecimalInput.vue';

/**
 * The component value
 */
const model = defineModel({
  type: Number,
  default: 0,
  validator(value) {
    return value >= 0 && value <= 359999.99;
  },
});

const props = defineProps({
  /**
   * Whether to show the hour field
   */
  showHours: {
    type: Boolean,
    default: true,
  },

  /**
   * The prefix for each field's aria-label
   */
  label: {
    type: String,
    default: '',
  },
});

/**
 * The internal value
 */
const internalValue = ref(model.value);

/**
 * The maximum value
 */
const max = computed(() => {
  return props.showHours ? 359999.99 : 3599.99;
});

/**
 * The value of the hours field
 */
const hours = computed({
  get() {
    return Math.floor(model.value / 3600);
  },
  set(newValue) {
    internalValue.value = (newValue * 3600) + (minutes.value * 60) + seconds.value;
  },
});

/**
 * The value of the minutes field
 */
const minutes = computed({
  get() {
    return Math.floor((model.value % 3600) / 60);
  },
  set(newValue) {
    internalValue.value = (hours.value * 3600) + (newValue * 60) + seconds.value;
  },
});

/**
 * The value of the seconds field
 */
const seconds = computed({
  get() {
    return model.value % 60;
  },
  set(newValue) {
    internalValue.value = (hours.value * 3600) + (minutes.value * 60) + newValue;
  },
});

/**
 * Update the internal value when the component value changes
 */
watch(model, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue;
  }
});

/**
 * Update the component value when the internal value changes
 */
watch(internalValue, (newValue) => {
  model.value = newValue;
});

/**
 * Process up and down arrow presses
 * @param {Object} e The keydown event args
 */
function onkeydown(e, step = 1) {
  if (e.key === 'ArrowUp') {
    if (Math.floor(internalValue.value) + step > max.value) {
      internalValue.value = max.value;
    } else {
      internalValue.value = Math.floor(internalValue.value) + step;
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (Math.ceil(internalValue.value) - step < 0) {
      internalValue.value = 0;
    } else {
      internalValue.value = Math.ceil(internalValue.value) - step;
    }
    e.preventDefault();
  }
}
</script>

<style scoped>
div {
  display: inline-block;
}
.hours, .minutes {
  width: 2.5em;
}
.seconds {
  width: 4em;
}
span {
  font-weight: bold;
  margin: 0px 0.2em;
}
</style>
