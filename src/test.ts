const card = (() => {
  const item = {
    initialInterval: 1, // days
    intervalFactor: 2,
    numIntervals: 5, // total observations
    currentInterval: 0,
  };

  function calculateInterval(index: number) {
    return item.initialInterval * Math.pow(item.intervalFactor, index);
  }

  function increaseExposure() {
    // item.currentInterval++;
    item.numIntervals++;
    item.intervalFactor -= 0.2;
  }
  function decreaseExposure() {
    // item.currentInterval--;
    item.numIntervals--;
    item.intervalFactor += 0.2;
  }

  return {
    item,
    calculateInterval,
    increaseExposure,
    decreaseExposure,
  };
})();

function expose() {
  const intervals = [];
  for (let i = 0; i < card.item.numIntervals; i++) {
    intervals.push(card.calculateInterval(i));
  }
  console.log('Intervals:', intervals);
}

expose();
card.increaseExposure();
expose();
card.increaseExposure();
expose();
