<template>
  <input ref="input" type="number" step="any" required @blur="onblur" v-model="stringValue">
</template>

<script>
import formatUtils from '@/utils/format';

export default {
  name: 'DecimalInput',

  props: {
    /**
     * The input value
     */
    modelValue: {
      type: Number,
      default: 0,
    },

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
  },

  data() {
    return {
      /**
       * The internal float value
       */
      internalValue: this.modelValue,

      /**
       * The raw string value (empty if input is currently invalid)
       */
      stringValue: this.format(this.modelValue),
    };
  },

  watch: {
    /**
     * Update the component value when the modelValue prop changes
     * @param {Number} newValue The new prop value
     */
    modelValue(newValue) {
      if (newValue !== this.internalValue) {
        this.internalValue = newValue;
        this.stringValue = this.format(this.internalValue);
      }
    },

    /**
     * Emit the input event when the internal value changes
     * @param {Number} newValue The new internal float value
     */
    internalValue(newValue) {
      this.$emit('update:modelValue', newValue);
    },

    /**
     * Update the float value when the raw string value changes
     * @param {Number} newValue The new raw string value
     */
    stringValue(newValue) {
      if (this.$refs.input.validity.valid) {
        this.internalValue = Number(newValue);
      }
    },
  },

  methods: {
    /**
     * Reformat display value if not invalid
     */
    onblur() {
      if (this.$refs.input.validity.valid) {
        this.stringValue = this.format(this.internalValue);
      }
    },

    /**
     * Format a decimal as a string
     * @param {Number} value The decimal
     * @returns {String} The formated string
     */
    format(value) {
      return formatUtils.formatNumber(value, this.padding, this.digits, true);
    },
  },
};
</script>

<style scoped>
input {
  width: 5em;  /* can fit 999.99 comfortably */
  text-align: center;
}
</style>
