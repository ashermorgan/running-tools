# Running Tools
A collection of tools for runners and their coaches.
Try it out [here](https://apps.ashermorgan.net/running-tools/).

## Features
- [Batch Calculator](https://apps.ashermorgan.net/running-tools/#/calculate/batch):
  Create tables of the results of the other calculators over a range of inputs
- [Pace Calculator](https://apps.ashermorgan.net/running-tools/#/calculate/paces):
  Calculate distances and times that are at the same pace
- [Race Calculator](https://apps.ashermorgan.net/running-tools/#/calculate/races):
  Estimate equivalent results for races of different distances and/or times
- [Split Calculator](https://apps.ashermorgan.net/running-tools/#/calculate/splits):
  Find splits, paces, and cumulative times for the segments of a race
- [Unit Calculator](https://apps.ashermorgan.net/running-tools/#/calculate/units):
  Convert between different distance, time, speed, and pace units
- [Workout Calculator](https://apps.ashermorgan.net/running-tools/#/calculate/workouts):
  Estimate target workout splits using previous race results

## Setup
Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

Run linter and tests

```
npm run lint
npm run test:unit
npm run test:e2e
```

Build for production

```
VITE_API_DOMAIN=https://example.com BASE_URL=/running-tools/ npm run build
```
