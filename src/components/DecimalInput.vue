<template>
  <input ref="inputElement" type="number" step="any" required @blur="onblur" v-model="stringValue">
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatNumber } from '@/utils/format';

/**
 * The component value
 */
const model = defineModel({
  type: Number,
  default: 0,
});

const props = defineProps({
  /**
   * The number of digits to show before the decimal point
   */
  padding: {
    type: Number,
    default: 0,
    validator(value: number) {
      return value >= 0;
    },
  },

  /**
   * The number of digits to show after the decimal point
   */
  digits: {
    type: Number,
    default: 1,
    validator(value: number) {
      return value > 0;
    },
  },
});

/**
 * The internal float value
 */
const internalValue = ref(model.value);

/**
 * The raw string value (empty if input is currently invalid)
 */
const stringValue = ref(format(model.value));

/**
 * The input element
 */
const inputElement = ref();

/*
 * Update the internal value when the component value changes
 */
watch(model, (newValue) => {
  if (Math.abs(newValue - internalValue.value) > 0.00001) {
    internalValue.value = newValue;
    stringValue.value = format(internalValue.value);
  }
});

/**
 * Update the internal value when the raw string value changes
 */
watch(stringValue, (newValue) => {
  if (inputElement.value.validity.valid) {
    internalValue.value = Number(newValue);
    model.value = internalValue.value;
  }
});

/**
 * Reformat display value if not invalid
 */
function onblur() {
  if (inputElement.value.validity.valid) {
    stringValue.value = format(internalValue.value);
  }
}

/**
 * Format a decimal as a string
 * @param {number} value The decimal
 * @returns {string} The formated string
 */
function format(value: number): string {
  return formatNumber(value, props.padding, props.digits, true);
}
</script>

<style scoped>
input {
  width: 5em;  /* can fit 999.99 comfortably */
  text-align: center;
}
</style>
