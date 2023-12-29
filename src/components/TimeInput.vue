<template>
  <div class="time-input">
    <integer-input class="hours" :aria-label="label + ' hours'" v-if="showHours"
      :min="0" :max="99" :padding="1" v-model="hours"
      :arrow-keys="false" @keydown="onkeydown($event, 3600)"/>
    <span v-if="showHours">:</span>
    <integer-input class="minutes" :aria-label="label + ' minutes'"
      :min="0" :max="59" :padding="2" v-model="minutes"
      :arrow-keys="false" @keydown="onkeydown($event, 60)"/>
    <span>:</span>
    <decimal-input class="seconds" :aria-label="label + ' seconds'"
      :min="0" :max="59.99" :padding="2" :digits="2" v-model="seconds"
      :arrow-keys="false" @keydown="onkeydown($event, 1)"/>
  </div>
</template>

<script>
import IntegerInput from '@/components/IntegerInput.vue';
import DecimalInput from '@/components/DecimalInput.vue';

export default {
  name: 'TimeInput',

  components: {
    IntegerInput,
    DecimalInput,
  },

  props: {
    /**
     * The input value
     */
    modelValue: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0 && value <= 359999.99;
      },
    },

    /**
     * Whether to show the hour field
     */
    showHours: {
      type: Boolean,
      default: true,
    },

    /**
     * The prefix for each field's aria-label
     */
    label: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      /**
       * The internal value
       */
      internalValue: this.modelValue,
    };
  },

  computed: {
    /**
     * The maximum value
     */
    max() {
      return this.showHours ? 359999.99 : 3599.99;
    },

    /**
     * The value of the hours field
     */
    hours: {
      get() {
        return Math.floor(this.modelValue / 3600);
      },
      set(newValue) {
        this.internalValue = (newValue * 3600) + (this.minutes * 60) + this.seconds;
      },
    },

    /**
     * The value of the minutes field
     */
    minutes: {
      get() {
        return Math.floor((this.modelValue % 3600) / 60);
      },
      set(newValue) {
        this.internalValue = (this.hours * 3600) + (newValue * 60) + this.seconds;
      },
    },

    /**
     * The value of the seconds field
     */
    seconds: {
      get() {
        return this.modelValue % 60;
      },
      set(newValue) {
        this.internalValue = (this.hours * 3600) + (this.minutes * 60) + newValue;
      },
    },
  },

  watch: {
    /**
     * Update the component value when the modelValue prop changes
     * @param {Number} newValue The new prop value
     */
    modelValue(newValue) {
      if (newValue !== this.internalValue) {
        this.internalValue = newValue;
      }
    },

    /**
     * Emit the input event when the component value changes
     * @param {Number} newValue The new component value
     */
    internalValue(newValue) {
      this.$emit('update:modelValue', newValue);
    },
  },

  methods: {
    /**
     * Process up and down arrow presses
     * @param {Object} e The keydown event args
     */
    onkeydown(e, step = 1) {
      if (e.key === 'ArrowUp') {
        if (this.internalValue + step > this.max) {
          this.internalValue = this.max;
        } else {
          this.internalValue += step;
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (this.internalValue - step < 0) {
          this.internalValue = 0;
        } else {
          this.internalValue -= step;
        }
        e.preventDefault();
      }
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
