<template>
  <input ref="inputElement" type="number" step="any" required @blur="onblur" v-model="stringValue">
</template>

<script setup>
import { ref, watch } from 'vue';
import formatUtils from '@/utils/format';

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
    validator(value) {
      return value >= 0;
    },
  },

  /**
   * The number of digits to show after the decimal point
   */
  digits: {
    type: Number,
    default: 1,
    validator(value) {
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
const inputElement = ref(null);

/*
 * Update the internal value when the component value changes
 */
watch(model, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue;
    stringValue.value = format(internalValue.value);
  }
});

/**
 * Update the component value when the internal value changes
 */
watch(internalValue, (newValue) => {
  model.value = newValue;
});

/**
 * Update the internal value when the raw string value changes
 */
watch(stringValue, (newValue) => {
  if (inputElement.value.validity.valid) {
    internalValue.value = Number(newValue);
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
 * @param {Number} value The decimal
 * @returns {String} The formated string
 */
function format(value) {
  return formatUtils.formatNumber(value, props.padding, props.digits, true);
}
</script>

<style scoped>
input {
  width: 5em;  /* can fit 999.99 comfortably */
  text-align: center;
}
</style>
