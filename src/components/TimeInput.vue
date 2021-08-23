<template>
  <div class="time-input">
    <int-input class="hours" aria-label="hours"
      :min="0" :max="99" :padding="1" v-model="hours"/>
    <span>:</span>
    <int-input class="minutes" aria-label="minutes"
      :min="0" :max="59" wrap :padding="2" v-model="minutes"/>
    <span>:</span>
    <decimal-input class="seconds" aria-label="seconds"
      :min="0" :max="59.99" wrap :padding="2" :digits="2" v-model="seconds"/>
  </div>
</template>

<script>
import IntInput from '@/components/IntInput.vue';
import DecimalInput from '@/components/DecimalInput.vue';

export default {
  name: 'TimeInput',

  components: {
    IntInput,
    DecimalInput,
  },

  props: {
    /**
     * The input value
     */
    value: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0 && value <= 86399.99;
      },
    },
  },

  data() {
    return {
      /**
       * The number of hours in the component value
       */
      hours: Math.floor(this.value / 3600),

      /**
       * The number of minutes in the component value
       */
      minutes: Math.floor((this.value % 3600) / 60),

      /**
       * The number of seconds in the component value
       */
      seconds: this.value % 60,
    };
  },

  computed: {
    /**
     * The value of the component
     */
    intValue() {
      return (this.hours * 3600) + (this.minutes * 60) + this.seconds;
    },
  },

  watch: {
    /**
     * Update the component value when the value prop changes
     * @param {Number} newValue The new prop value
     */
    value(newValue) {
      if (newValue !== this.intValue) {
        this.hours = Math.floor(newValue / 3600);
        this.minutes = Math.floor((newValue % 3600) / 60);
        this.seconds = newValue % 60;
      }
    },

    /**
     * Emit the input event when the component value changes
     * @param {Number} newValue The new component value
     */
    intValue(newValue) {
      this.$emit('input', newValue);
    },
  },
};
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
