<template>
  <input ref="inputElement" type="number" step="1" required @blur="onblur" v-model="stringValue">
</template>

<script setup>
import { ref, watch } from 'vue';

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
});

/**
 * The internal integer value
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

/**
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
 * Format an integer as a string
 * @param {Number} value The integer
 * @returns {String} The formated string
 */
function format(value) {
  return value.toString().padStart(props.padding, '0');
}
</script>

<style scoped>
input {
  width: 3em;  /* can fit 999 comfortably */
  text-align: center;
}
</style>
