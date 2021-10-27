<template>
  <div class="time-input">
    <int-input class="hours" aria-label="hours"
      :min="0" :max="99" :padding="1" v-model="hours"
      :arrow-keys="false" @keydown="onkeydown($event, 3600)"/>
    <span>:</span>
    <int-input class="minutes" aria-label="minutes"
      :min="0" :max="59" :padding="2" v-model="minutes"
      :arrow-keys="false" @keydown="onkeydown($event, 60)"/>
    <span>:</span>
    <decimal-input class="seconds" aria-label="seconds"
      :min="0" :max="59.99" :padding="2" :digits="2" v-model="seconds"
      :arrow-keys="false" @keydown="onkeydown($event, 1)"/>
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
        return value >= 0 && value <= 359999.99;
      },
    },
  },

  data() {
    return {
      /**
       * The internal value
       */
      internalValue: this.value,
    };
  },

  computed: {
    /**
     * The value of the hours field
     */
    hours: {
      get() {
        return Math.floor(this.value / 3600);
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
        return Math.floor((this.value % 3600) / 60);
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
        return this.value % 60;
      },
      set(newValue) {
        this.internalValue = (this.hours * 3600) + (this.minutes * 60) + newValue;
      },
    },
  },

  watch: {
    /**
     * Update the component value when the value prop changes
     * @param {Number} newValue The new prop value
     */
    value(newValue) {
      if (newValue !== this.internalValue) {
        this.internalValue = newValue;
      }
    },

    /**
     * Emit the input event when the component value changes
     * @param {Number} newValue The new component value
     */
    internalValue(newValue) {
      this.$emit('input', newValue);
    },
  },

  methods: {
    /**
     * Process up and down arrow presses
     * @param {Object} e The keydown event args
     */
    onkeydown(e, step = 1) {
      if (e.key === 'ArrowUp') {
        if (this.internalValue + step > 359999.99) {
          this.internalValue = 359999.99;
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
