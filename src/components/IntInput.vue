<template>
  <input @keydown="keydown" @keypress="keypress" v-model="stringValue">
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
      default: 0,
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
      intValue: this.value,

      /**
       * The value of the input
       */
      stringValue: this.value.toString(),
    };
  },

  watch: {
    /**
     * Update the internal value from the value prop
     */
    value: function(newValue) {
      this.stringValue = newValue;
    },

    /**
     * Trigger the input event
     */
    intValue: function(newValue) {
      this.$emit('input', newValue);
    },

    /**
     * Validate the new value
     */
    stringValue: function(newValue, oldValue) {
      // Parse new value
      let parsedValue = parseInt(newValue);

      // Make sure value is a number
      if (isNaN(parsedValue)) {
        if (newValue === '') {
          parsedValue = 0;
          this.stringValue = '0';
        }
        else {
          parsedValue = this.intValue;
          this.stringValue = oldValue;
        }
      }

      // Enforce minimum and maximum
      else if (this.min !== null && parsedValue < this.min) {
        parsedValue = this.min;
        this.stringValue = this.min.toString();
      }
      else if (this.max !== null && parsedValue > this.max) {
        parsedValue = this.max;
        this.stringValue = this.max.toString();
      }

      // Make sure new value is correctly formatted
      else if (newValue !== parsedValue.toString()) {
        this.stringValue = parsedValue.toString();
      }

      // Update intValue
      this.intValue = parsedValue;
    },
  },

  methods: {
    /**
     * Restrict input to numbers
     */
    keypress: function(e) {
      if (!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        /* key press was not a number */
        e.preventDefault();
      }
    },

    /**
     * Process up and down arrow presses
     */
    keydown: function(e) {
      if (e.key === 'ArrowUp') {
        this.stringValue = (parseInt(this.stringValue) + 1).toString();
        e.preventDefault();
      }
      else if (e.key === 'ArrowDown') {
        this.stringValue = (parseInt(this.stringValue) - 1).toString();
        e.preventDefault();
      }
    }
  },
}
</script>
