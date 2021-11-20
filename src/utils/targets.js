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

export default {
  sort,
};
