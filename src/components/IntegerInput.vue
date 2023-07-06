<template>
  <input
    ref="input"
    @blur="onblur"
    @keydown="onkeydown"
    @keypress="onkeypress"
    v-model="stringValue">
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
     * The minimum value
     */
    min: {
      type: Number,
      default: null,
    },

    /**
     * The maximum value
     */
    max: {
      type: Number,
      default: null,
    },

    /**
     * The step value
     */
    step: {
      type: Number,
      default: 1,
    },

    /**
     * Whether to allow the user to increment/decrement the value using the arrow keys
     */
    arrowKeys: {
      type: Boolean,
      default: true,
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
       * The internal value
       */
      internalValue: this.format(this.modelValue),
    };
  },

  computed: {
    /**
     * The value of the input element
     */
    stringValue: {
      get() {
        return this.internalValue;
      },
      set(newValue) {
        // Parse new value
        const parsedValue = this.parse(newValue);

        if (newValue === '' || newValue === '-') {
          // Allow input to be '' or '-'
          this.internalValue = newValue;
        } else if (this.min !== null && parsedValue < this.min) {
          // Enforce minimum
          this.internalValue = this.format(this.min);
        } else if (this.max !== null && parsedValue > this.max) {
          // Enforce maximum
          this.internalValue = this.format(this.max);
        } else if (!Number.isNaN(parsedValue)) {
          // Allow valid numbers
          this.internalValue = newValue;
        }

        // Make sure input element is updated
        if (this.$refs.input.value === newValue) {
          // Setter was called by the input element
          if (this.internalValue !== newValue) {
            // The value was corrected, so the input element must be updated
            this.$refs.input.value = this.internalValue;
          }
        }
      },
    },

    /**
     * The value of the component
     */
    intValue: {
      get() {
        const parsedValue = parseInt(this.stringValue, 10);
        return Number.isNaN(parsedValue) ? this.defaultValue : parsedValue;
      },
      set(newValue) {
        this.stringValue = this.format(newValue);
      },
    },

    /**
     * The default value of the component
     */
    defaultValue() {
      if (this.min > 0 || this.max < 0) {
        return this.min;
      }
      return 0;
    },
  },

  watch: {
    /**
     * Update the component value when the modelValue prop changes
     * @param {Number} newValue The new prop value
     */
    modelValue(newValue) {
      if (newValue !== this.intValue) {
        this.intValue = newValue;
      }
    },

    /**
     * Emit the input event when the component value changes
     * @param {Number} newValue The new component value
     */
    intValue(newValue) {
      this.$emit('update:modelValue', newValue);
    },
  },

  methods: {
    /**
     * Restrict input to numbers
     * @param {Object} e The keypress event args
     */
    onkeypress(e) {
      const validKeys = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (!validKeys.includes(e.key)) {
        /* key was not a number */
        e.preventDefault();
      }
    },

    /**
     * Process up and down arrow presses
     * @param {Object} e The keydown event args
     */
    onkeydown(e) {
      if (this.arrowKeys) {
        if (e.key === 'ArrowUp') {
          this.intValue += this.step;
        } else if (e.key === 'ArrowDown') {
          this.intValue -= this.step;
        }
        e.preventDefault();
      }
    },

    /**
     * Reformat display value
     */
    onblur() {
      this.stringValue = this.format(this.intValue);
    },

    /**
     * Parse an integer from a string
     * @param {String} value The string
     * @returns {Number} The parsed integer
     */
    parse(value) {
      if (value.includes('.')) {
        // value cannot be parsed as an integer
        return NaN;
      }

      return Number(value);
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
