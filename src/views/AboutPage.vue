<template>
  <div class="about-page">
    <p>
      Running Tools is an open source collection of tools for runners and their coaches.
      All calculations are performed locally on your device.
      This is Running Tools version {{ version }}{{ development ? ' (dev)' : '' }}.
    </p>

    <h2>Installation</h2>
    <p>
      Running Tools can be installed as a progressive web app so it works offline:
      <ul>
        <li>On iOS devices, open Running Tools in Safari, press <span aria-label="Share">
          <vue-feather type="share" aria-hidden="true"/></span>, and select Add to Home Screen</li>
        <li>On all other platforms, open Running Tools in Chrome and click Install
          <img src="@/assets/chrome-install.png" height="24" class="chrome-install" alt=""/>
        </li>
      </ul>
    </p>

    <h2>The Calculators</h2>
    <p>Running Tools contains four calculators:</p>

    <h3>Pace Calculator</h3>
    <p>
      The <router-link :to="{ name: 'calculate-paces' }">Pace Calculator</router-link> takes a
        distance and duration as input and shows other distances and times that result in
        the same pace.
      The selected target set controls which distances and/or times the calculator shows output for.
    </p>
    <p>
      The Pace Calculator is useful for answering questions like:
    </p>
    <ul class="questions">
      <li>How far would I go in 30 minutes if I run 8 minutes per mile? (3.75 miles)</li>
      <li>What do I have to run per mile to finish a marathon in three hours? (6:52 per mile)</li>
    </ul>


    <h3>Race Calculator</h3>
    <p>
      The <router-link :to="{ name: 'calculate-races' }">Race Calculator</router-link> takes a
        distance and duration as input and shows other distances and durations that would be
        equivalent race results.
      The selected target set controls which distances and/or times the calculator predicts race
        results for.
    </p>
    <p>
      The Advanced section of the Race Calculator includes extra output statistics for the input
        race result and the option to switch between the five supported race prediction models:
    </p>
      <ul>
        <li>The Purdy Points Model</li>
        <li>The V&#775;O&#8322; Max Model</li>
        <li>Dave Cameron's Model</li>
        <li>Pete Riegel's Model</li>
        <li>Average Model (averages the output of the other four models)</li>
      </ul>
      <p>
    </p>
    <p>
      The Race Calculator is useful for answering questions like:
    </p>
    <ul class="questions">
      <li>If I raced a 5k in 20:00, how fast could I race a 10k? (about 41:35)</li>
      <li>Which is a better race result, a 20:00 5K or a 5:00 Mile? (a 5:00 Mile)</li>
    </ul>
    <p>
      <strong>Note:</strong> Output race times and V&#775;O&#8322; / V&#775;O&#8322; Max values are
        just estimates.
      Race predictions are most accurate for similar distances and assume identical conditions and
        equal fitness.
    </p>

    <h3>Split Calculator</h3>
    <p>
      The <router-link :to="{ name: 'calculate-splits' }">Split Calculator</router-link> takes a set
        of split times at certain distances as input and calculates the pace and cumulative time for
        each split.
      The selected target set controls which distances are used for the splits.
    </p>
    <p>
      The Split Calculator is useful for answering questions like:
    </p>
    <ul class="questions">
      <li>How fast would I finish a 1600m if I ran the 400m laps in 90s, 85s, 80s, and 75s? (5:30)</li>
      <li>If I finished a 5K in 20:00 and ran the first 2 miles in 13:00, how fast was the last ~1.1
        miles? (6:19 per mile pace)</li>
    </ul>
    <p>
      <strong>Note:</strong> The split calculator only works with distance targets and ignores all
        time targets.
    </p>

    <h3>Unit Calculator</h3>
    <p>
      The <router-link :to="{ name: 'calculate-units' }">Unit Calculator</router-link> converts
        between different units and formats.
    </p>
    <p>
      This is useful for answering questions like:
    </p>
    <ul class="questions">
      <li>How many miles is a 5K? (3.107 miles)</li>
      <li>What is 10 mph in time per mile? (6:00 per mile)</li>
      <li>What is 123.4 minutes in hh:mm:ss? (02:03:24)</li>
    </ul>

    <h2>Target Sets</h2>
    <p>
      A target set is a collection of distances and times that the Pace, Race, and Split Calculators
        will calculate results for.
      These calculators will output a duration for each distance target and a distance for each time
        target.
      Running Tools comes with three default target sets.
      You can switch between these sets, modify the targets they contain, and add new targets sets
        from within each supporting calculator.
    </p>
    <p>
      <strong>Note:</strong> The split calculator only works with distance targets and ignores all
        time targets.
    </p>
  </div>
</template>

<script>
import { version } from '/package.json';

import VueFeather from 'vue-feather';

export default {
  name: 'AboutPage',

  components: {
    VueFeather
  },

  data() {
    return {
      version,
      development: process.env.NODE_ENV === 'development',
    };
  },
};
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: auto;
  font-size: 1.1em;
}
h2 {
  text-align: center;
}
h2, h3 {
  margin-top: 1em;
}
p, blockquote, ul {
  margin-bottom: 0.5em;
}
li {
  margin-bottom: 0.2em;
  margin-left: 3em;
}
p {
  line-height: 1.3;
}
.questions {
  font-style: italic;
}
.vue-feather {
    position: relative;
    top: 3px;
}
.chrome-install {
    vertical-align: top;
}
@media only screen and (prefers-color-scheme: dark) {
    .chrome-install {
        filter: invert(1);
    }
}
@media only screen and (max-width: 800px) {
    li {
        margin-left: 1.5em;
    }
}
</style>
