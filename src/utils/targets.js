import unitUtils from '@/utils/units';

/**
 * Sort an array of targets
 * @param {Array} targets The array of targets
 * @returns {Array} The sorted targets
 */
function sort(targets) {
  return [
    ...targets.filter((item) => item.result === 'time')
      .sort((a, b) => unitUtils.convertDistance(a.distanceValue, a.distanceUnit, 'meters')
        - unitUtils.convertDistance(b.distanceValue, b.distanceUnit, 'meters')),

    ...targets.filter((item) => item.result === 'distance')
      .sort((a, b) => a.time - b.time),
  ];
}

const defaultTargetSets = {
  '_pace_targets': {
    name: 'Common Pace Targets',
    targets: [
      { result: 'time', distanceValue: 100, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 200, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 300, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 400, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 600, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 800, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 1000, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 1200, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 1500, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 1600, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 3200, distanceUnit: 'meters' },

      { result: 'time', distanceValue: 2, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 3, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 4, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 6, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 8, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },

      { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 5, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 6, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 8, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 10, distanceUnit: 'miles' },

      { result: 'time', distanceValue: 0.5, distanceUnit: 'marathons' },
      { result: 'time', distanceValue: 1, distanceUnit: 'marathons' },

      { result: 'distance', time: 600 },
      { result: 'distance', time: 1800 },
      { result: 'distance', time: 3600 },
    ],
  },
  '_race_targets': {
    name: 'Common Race Targets',
    targets: [
      { result: 'time', distanceValue: 400, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 800, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 1500, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 1600, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 3000, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 3200, distanceUnit: 'meters' },
      { result: 'time', distanceValue: 2, distanceUnit: 'miles' },

      { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 6, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 8, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },
      { result: 'time', distanceValue: 15, distanceUnit: 'kilometers' },

      { result: 'time', distanceValue: 0.5, distanceUnit: 'marathons' },
      { result: 'time', distanceValue: 1, distanceUnit: 'marathons' },
    ],
  },
  '_split_targets': {
    name: '5K Mile Splits',
    targets: [
      { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
      { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
    ],
  },
};

const defaultTargetSet = {
  name: 'New target set',
  targets: [],
};

export default {
  sort,
  defaultTargetSets,
  defaultTargetSet,
};
