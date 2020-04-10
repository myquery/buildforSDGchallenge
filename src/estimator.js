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

// Compute infected per time
const infectedSnapshot = (currInfected, multiplyBydays) => currInfected * (2 ** multiplyBydays);

// Compute available per hospital
// eslint-disable-next-line max-len
const availableBedsPerHospital = (bedsPerHospital, severeCases, multiplyBydays) => Math.floor(((bedsPerHospital - severeCases) * multiplyBydays) * 0.35);

// Compute severe cases
const infectedPerTime = (infected, multiply) => Math.floor(infected * multiply);

// Compute currently Infected with covid-19 per region
const currentlyInfectedByRegion = (cases, multiply) => Math.trunc(cases * multiply);

const covid19ImpactEstimator = (data) => {
  const output = {
    data,
    impact: {},
    severeImpact: {}
  };
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = output.data;

  // Challenge 1
  const days = timeToDays(timeToElapse, periodType);
  output.impact.currentlyInfected = currentlyInfectedByRegion(reportedCases, 10);
  output.severeImpact.currentlyInfected = currentlyInfectedByRegion(reportedCases, 50);
  // eslint-disable-next-line max-len
  output.impact.infectionsByRequestedTime = infectedSnapshot(output.impact.currentlyInfected, days);
  // eslint-disable-next-line max-len
  output.severeImpact.infectionsByRequestedTime = infectedSnapshot(output.severeImpact.currentlyInfected, days);

  // Challenge 2
  // eslint-disable-next-line max-len
  output.impact.severeCasesByRequestedTime = infectedPerTime(output.impact.infectionsByRequestedTime, 0.15);
  // eslint-disable-next-line max-len
  output.severeImpact.severeCasesByRequestedTime = infectedPerTime(output.severeImpact.infectionsByRequestedTime, 0.15);
  // eslint-disable-next-line max-len
  output.impact.hospitalBedsByRequestedTime = availableBedsPerHospital(totalHospitalBeds, output.impact.severeCasesByRequestedTime, days);

  // eslint-disable-next-line max-len
  output.severeImpact.hospitalBedsByRequestedTime = availableBedsPerHospital(totalHospitalBeds, output.severeImpact.severeCasesByRequestedTime, days);
  return output;
};

export default covid19ImpactEstimator;
