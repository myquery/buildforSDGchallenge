// Estimate the number per period of time
const timeToDays = (timeToElapse, periodType) => {
  let days;
  if (periodType === 'days') {
    if (timeToElapse > 2) {
      days = Math.floor(timeToElapse / 3);
    } else {
      days = 1;
    }
  }
  if (periodType === 'weeks') {
    const toDays = timeToElapse * 7;
    days = Math.floor(toDays / 3);
  }
  if (periodType === 'months') {
    const toDays = timeToElapse * 30;
    days = Math.floor(toDays / 3);
  }
  return days;
};

// Compute available per hospital
const availableBeds = (bedsPerHospital, severeCases) => (bedsPerHospital - severeCases) * 0.01;

// Compute severe cases
const infectedPerTime = (infected, multiply) => infected * multiply;

const covid19ImpactEstimator = (data) => {
  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  // Challenge 1
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = output.data;
  const days = timeToDays(timeToElapse, periodType);
  output.impact.currentlyInfected = Math.trunc(reportedCases * 10);
  output.severeImpact.currentlyInfected = Math.trunc(reportedCases * 50);
  // eslint-disable-next-line max-len
  output.impact.infectionsByRequestedTime = output.impact.currentlyInfected * (2 ** days);
  // eslint-disable-next-line max-len
  output.severeImpact.infectionsByRequestedTime = output.severeImpact.currentlyInfected * (2 ** days);

  // Challenge 2
  // eslint-disable-next-line max-len
  output.impact.severeCasesByRequestedTime = infectedPerTime(output.impact.infectionsByRequestedTime, 0.15);
  // eslint-disable-next-line max-len
  output.severeImpact.severeCasesByRequestedTime = infectedPerTime(output.severeImpact.infectionsByRequestedTime, 0.15);
  // eslint-disable-next-line max-len
  output.impact.hospitalBedsByRequestedTime = availableBeds(totalHospitalBeds, output.impact.severeCasesByRequestedTime);

  // eslint-disable-next-line max-len
  output.severeImpact.hospitalBedsByRequestedTime = availableBeds(totalHospitalBeds, output.severeImpact.severeCasesByRequestedTime);
  return output;
};

export default covid19ImpactEstimator;
