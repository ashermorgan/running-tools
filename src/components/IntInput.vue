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
  name: 'IntInput',

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
  },

  data: function() {
    return {
      /**
       * The internal value
       */
      internalValue: this.value.toString(),
    };
  },

  computed: {
    /**
     * The value of the input element
     */
    stringValue: {
      get: function() {
        return this.internalValue;
      },
      set: function(newValue) {
        // Parse new value
        let parsedValue = this.parse(newValue);

        // Allow input to be '' or '-'
        if (newValue === '' || newValue === '-') {
          this.internalValue = newValue;
        }

        // Enforce minimum
        else if (this.min !== null && parsedValue < this.min) {
          this.internalValue = this.min.toString();
        }

        // Enforce maximum
        else if (this.max !== null && parsedValue > this.max) {
          this.internalValue = this.max.toString();
        }

        // Allow valid numbers
        else if (!isNaN(parsedValue)) {
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
      get: function() {
        let parsedValue = parseInt(this.stringValue);
        return isNaN(parsedValue) ? this.defaultValue : parsedValue;
      },
      set: function(newValue) {
        this.stringValue = newValue.toString();
      }
    },

    /**
     * The default value of the component
     */
    defaultValue: function() {
      if (0 < this.min || 0 > this.max) {
        return this.min;
      }
      else {
        return 0;
      }
    }
  },

  watch: {
    /**
     * Update the component value when the value prop changes
     * @param {Number} newValue The new prop value
     */
    value: function(newValue) {
      this.intValue = newValue;
    },

    /**
     * Emit the input event when the component value changes
     * @param {Number} newValue The new component value
     */
    intValue: function(newValue) {
      this.$emit('input', newValue);
    },
  },

  methods: {
    /**
     * Restrict input to numbers
     * @param {Object} e The keypress event args
     */
    onkeypress: function(e) {
      let validKeys = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (!validKeys.includes(e.key)) {
        /* key was not a number */
        e.preventDefault();
      }
    },

    /**
     * Process up and down arrow presses
     * @param {Object} e The keydown event args
     */
    onkeydown: function(e) {
      if (e.key === 'ArrowUp') {
        this.intValue++;
        e.preventDefault();
      }
      else if (e.key === 'ArrowDown') {
        this.intValue--;
        e.preventDefault();
      }
    },

    /**
     * Reformat display value
     * @param {Object} e The blur event args
     */
    onblur: function(e) {
      this.stringValue = this.intValue.toString();
    },

    /**
     * Parse an integer from a string
     * @param {String} value The string
     * @returns {Number} The parsed integer
     */
    parse: function(value) {
      if (value.includes('.')) {
        // value cannot be parsed as an integer
        return NaN;
      }
      else {
        return Number(value);
      }
    }
  },
}
</script>
