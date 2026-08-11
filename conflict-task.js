(function exposeConflictTask(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ConflictTask = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createConflictTaskApi() {
  const directions = ['up', 'right', 'down', 'left'];

  function getTargetDirection(arrowDirection, isReversed) {
    const arrowIndex = directions.indexOf(arrowDirection);
    if (arrowIndex === -1) throw new Error(`Unknown direction: ${arrowDirection}`);
    return directions[isReversed ? (arrowIndex + 2) % directions.length : arrowIndex];
  }

  function getSwipeDirection(deltaX, deltaY, minDistance = 24) {
    if (Math.hypot(deltaX, deltaY) < minDistance) return null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) return deltaX > 0 ? 'right' : 'left';
    return deltaY > 0 ? 'down' : 'up';
  }

  function createTrials(trialCount = 10, random = Math.random) {
    if (!Number.isInteger(trialCount) || trialCount <= 0 || trialCount % 2 !== 0) {
      throw new Error('trialCount must be a positive even integer');
    }

    const half = trialCount / 2;
    const conditions = Array(half).fill(false).concat(Array(half).fill(true));
    for (let i = conditions.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [conditions[i], conditions[j]] = [conditions[j], conditions[i]];
    }

    return conditions.map(isReversed => {
      const arrowDirection = directions[Math.floor(random() * directions.length)];
      return {
        isReversed,
        arrowDirection,
        targetDirection: getTargetDirection(arrowDirection, isReversed),
        rt: null,
        correct: false
      };
    });
  }

  return { directions: [...directions], getTargetDirection, getSwipeDirection, createTrials };
});
