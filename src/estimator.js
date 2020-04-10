// Estimate the number per period of time
const timeToDays = (timeToElapse, periodType) => {
  switch (periodType) {
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30;
    default:
      return timeToElapse;
  }
};

const covid19ImpactEstimator = (data) => {
  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  const days = timeToDays(data.timeToElapse, data.periodType);
  output.impact.currentlyInfected = Math.trunc(data.reportedCases * 10 * 1024);
  output.severeImpact.currentlyInfected = Math.trunc(data.reportedCases * 50 * 1024);
  // eslint-disable-next-line max-len
  output.impact.infectionsByRequestedTime = output.impact.currentlyInfected * (2 ** Math.floor(days / 3));
  // eslint-disable-next-line max-len
  output.severeImpact.infectionsByRequestedTime = output.severeImpact.currentlyInfected * (2 ** Math.floor(days / 3));
  return output;
};

export default covid19ImpactEstimator;
