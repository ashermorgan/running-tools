import unitUtils from '@/utils/units';

/**
 * Sort an array of targets
 * @param {Array} targets The array of targets
 * @returns {Array} The sorted targets
 */
function sort(targets) {
  return [
    ...targets.filter((item) => item.type === 'distance')
      .sort((a, b) => unitUtils.convertDistance(a.distanceValue, a.distanceUnit, 'meters')
        - unitUtils.convertDistance(b.distanceValue, b.distanceUnit, 'meters')),

    ...targets.filter((item) => item.type === 'time')
      .sort((a, b) => a.time - b.time),
  ];
}

const defaultTargetSets = {
  '_pace_targets': {
    name: 'Common Pace Targets',
    targets: [
      { type: 'distance', distanceValue: 100, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 200, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 300, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 600, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 1000, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 1200, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 1500, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 3200, distanceUnit: 'meters' },

      { type: 'distance', distanceValue: 2, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 3, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 4, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 6, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 8, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },

      { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 5, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 6, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 8, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 10, distanceUnit: 'miles' },

      { type: 'distance', distanceValue: 0.5, distanceUnit: 'marathons' },
      { type: 'distance', distanceValue: 1, distanceUnit: 'marathons' },

      { type: 'time', time: 600 },
      { type: 'time', time: 1800 },
      { type: 'time', time: 3600 },
    ],
  },
  '_race_targets': {
    name: 'Common Race Targets',
    targets: [
      { type: 'distance', distanceValue: 400, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 800, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 1500, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 1600, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 3000, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 3200, distanceUnit: 'meters' },
      { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },

      { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 6, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 8, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      { type: 'distance', distanceValue: 15, distanceUnit: 'kilometers' },

      { type: 'distance', distanceValue: 0.5, distanceUnit: 'marathons' },
      { type: 'distance', distanceValue: 1, distanceUnit: 'marathons' },
    ],
  },
  '_split_targets': {
    name: '5K Mile Splits',
    targets: [
      { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
      { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
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
