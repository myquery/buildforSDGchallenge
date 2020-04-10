// Estimate the number per period of time
const timeToDays = (timeToElapse, periodType) => {
  let days;
  if (periodType === 'days') {
    if (timeToElapse > 2) {
      days = Math.floor(this.timeToElapse / 3);
    } else {
      days = 1;
    }
  }
  if (periodType === 'weeks') {
    const toDays = timeToElapse * 7;
    days = Math.floor(toDays / 3);
  }
  if (this.periodType === 'months') {
    const toDays = this.timeToElapse * 30;
    days = Math.floor(toDays / 3);
  }
  return days;
};

const covid19ImpactEstimator = (data) => {
  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  const days = timeToDays(data.timeToElapse, data.periodType);
  output.impact.currentlyInfected = Math.trunc(data.reportedCases * 10);
  output.severeImpact.currentlyInfected = Math.trunc(data.reportedCases * 50);
  // eslint-disable-next-line max-len
  output.impact.infectionsByRequestedTime = output.impact.currentlyInfected * (2 ** Math.floor(days / 3));
  // eslint-disable-next-line max-len
  output.severeImpact.infectionsByRequestedTime = output.severeImpact.currentlyInfected * (2 ** Math.floor(days / 3));
  return output;
};

export default covid19ImpactEstimator;
