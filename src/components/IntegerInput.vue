<template>
  <input ref="input" type="number" step="1" required @blur="onblur" v-model="stringValue">
</template>

<script>
export default {
  name: 'IntegerInput',

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
  },

  data() {
    return {
      /**
       * The internal integer value
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
     * @param {Number} newValue The new internal integer value
     */
    internalValue(newValue) {
      this.$emit('update:modelValue', newValue);
    },

    /**
     * Update the integer value when the raw string value changes
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
     * Format an integer as a string
     * @param {Number} value The integer
     * @returns {String} The formated string
     */
    format(value) {
      return value.toString().padStart(this.padding, '0');
    },
  },
};
</script>

<style scoped>
input {
  width: 3em;  /* can fit 999 comfortably */
  text-align: center;
}
</style>
