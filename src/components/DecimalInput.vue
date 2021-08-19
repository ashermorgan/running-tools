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
  name: 'DecimalInput',

  props: {
    /**
     * The input value
     */
    value: {
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
       * The internal value
       */
      internalValue: this.format(this.value),
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

        if (newValue === '' || newValue === '-' || newValue === '.') {
          // Allow input to be '' or '-' or '.'
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
    decValue: {
      get() {
        const parsedValue = parseFloat(this.stringValue);
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
     * Update the component value when the value prop changes
     * @param {Number} newValue The new prop value
     */
    value(newValue) {
      if (newValue !== this.decValue) {
        this.decValue = newValue;
      }
    },

    /**
     * Emit the input event when the component value changes
     * @param {Number} newValue The new component value
     */
    decValue(newValue) {
      this.$emit('input', newValue);
    },
  },

  methods: {
    /**
     * Restrict input to valid keys
     * @param {Object} e The keypress event args
     */
    onkeypress(e) {
      const valid = ['.', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (!valid.includes(e.key)) {
        /* key was not valid */
        e.preventDefault();
      }
    },

    /**
     * Process up and down arrow presses
     * @param {Object} e The keydown event args
     */
    onkeydown(e) {
      if (e.key === 'ArrowUp') {
        this.decValue += 1;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        this.decValue -= 1;
        e.preventDefault();
      }
    },

    /**
     * Reformat display value
     */
    onblur() {
      this.stringValue = this.format(this.decValue);
    },

    /**
     * Parse a decimal from a string
     * @param {String} value The string
     * @returns {Number} The parsed decimal
     */
    parse(value) {
      return Number(value);
    },

    /**
     * Format a decimal as a string
     * @param {Number} value The decimal
     * @returns {String} The formated string
     */
    format(value) {
      const result = value.toFixed(this.digits);
      return result.padStart(this.padding + this.digits + 1, '0');
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
