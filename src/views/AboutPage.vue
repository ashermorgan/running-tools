<template>
  <div class="about-page">
    <p>
      Running Tools is an <a :href="git_url">open source</a> collection of tools for runners
        and their coaches.
      All calculations are performed locally on your device.
      This is Running Tools version {{ version }}{{ development ? ' (dev)' : '' }}.
    </p>

    <h2>Installation</h2>
    <p>
      Running Tools can be installed as a progressive web app so it works offline:
    </p>
    <ul>
      <li>On iOS devices, open Running Tools in Safari, press <span aria-label="Share">
        <vue-feather type="share" aria-hidden="true"/></span>, and select Add to Home Screen</li>
      <li>On all other platforms, open Running Tools in Chrome and click Install
        <img src="@/assets/chrome-install.png" height="24" class="chrome-install" alt=""/>
      </li>
    </ul>

    <h2>The Calculators</h2>
    <p>
      Running Tools consists of six calculators.
      The Pace, Race, and Unit Calculators are the simplest to use, while the Batch, Split, and
        Workout Calculators are designed for more advanced use cases.
    </p>

    <h3>Batch Calculator</h3>
    <p>
      The <router-link :to="{ name: 'calculate-batch' }">Batch Calculator</router-link> calculates
        results for a range of input times using the Pace, Race, or Workout Calculators.
      Options such as the default unit system, selected target set, and race prediction model are
        synced from the active calculator.
      If the Workout Calculator is being used with custom workout names enabled, a custom name may
        also be specified for the batch column header.
    </p>
    <p>
      The Batch Calculator is useful for tasks such as:
    </p>
    <ul class="questions">
      <li>Generating a table of marathon finish times and the corresponding mile splits.</li>
      <li>Generating a table of equivalent race results for many distances and speeds.</li>
      <li>Generating a table of workout split times for an entire team.</li>
    </ul>

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
      Extra output statistics for the input race result are also available under the Race Statistics
        section.
    </p>
    <p>
      The Advanced Options section includes the option to switch between the five supported race
        prediction models:
    </p>
      <ul>
        <li>The Purdy Points Model</li>
        <li>The V&#775;O&#8322; Max Model</li>
        <li>Dave Cameron's Model</li>
        <li>Pete Riegel's Model (includes a configurable exponent)</li>
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
      Race predictions assume equivalent fitness and conditions to the input race, and are most
        accurate for similar distances.
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
        miles? (6:19 / mi pace)</li>
    </ul>

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
      <li>What is 10 mph in time per mile? (6:00 / mi)</li>
      <li>What is 123.4 minutes in hh:mm:ss? (02:03:24)</li>
    </ul>

    <h3>Workout Calculator</h3>
    <p>
      The <router-link :to="{ name: 'calculate-workouts' }">Workout Calculator</router-link> takes a
        distance and duration as input and shows intermediate splits for other equivalent race
        results.
      The selected target set controls which race distances and/or times the calculator calculates
        outputs for and the distances of the splits that are shown for these races.
      The Advanced Options section includes the option to switch between the same five prediction
        models that are available in the Race Calculator, as well as the ability to enable support
        for specifying custom workout names (e.g. "1 mile threshold" instead of "1 mi @ 1:00:00").
    </p>
    <p>
      The Workout Calculator is useful for answering questions like:
    </p>
    <ul class="questions">
      <li>If I raced a 5K in 20:00, how fast should I run 400m reps at mile pace? (about 1:27)</li>
      <li>If I raced a mile in 5:00, what is my "threshold" (~1 hr race) pace? (about 5:52 / mi)</li>
    </ul>
    <p>
      <strong>Note:</strong> Results are just estimated race splits that are helpful for estimating
        target workout splits.
      As with the Race Calculator, splits assume equivalent fitness and conditions to the input
        race, and are most accurate for similar paces.
    </p>

    <h2>Target Sets</h2>
    <p>
      A target set is a collection of distances and/or times that the Pace, Race, Split, or Workout
        Calculators will calculate results for.
      These calculators will output a duration for each distance target and a distance for each time
        target.
      Each of these calculators comes with a default target set and allows you to add new target
        sets, modify existing target sets, and switch between sets that belong to the same
        calculator.
    </p>
    <p>
      <strong>Note:</strong> The Split Calculator only supports distance targets. The Workout
        Calculator also includes a split distance field for each target.
    </p>
  </div>
</template>

<script setup lang="ts">
import { repository, version } from '/package.json';

import VueFeather from 'vue-feather';

const development: boolean = process.env.NODE_ENV === 'development';
const git_url: string = repository.url.slice(4);
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
  margin-left: 1.5em;
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
</style>
