const timeToDays = (periodType, count) => {
  if (periodType === 'days') {
    return count;
  }
  if (periodType === 'weeks') {
    return count * 7;
  }
  if (periodType === 'months') {
    return count * 30;
  }
  return count;
};

const currentlyInfected = (cases, multiplier) => cases * multiplier;
const infectionsByReqTime = (infected, factor) => infected * factor;
const avgOccupiedBeds = (availableBeds) => availableBeds * 0.65;
const severeCasesByTime = (severeCases) => Math.trunc(severeCases * 0.15);
const getCasesForICU = (infected) => infected * 0.05;
const getCasesforVentilator = (infected) => infected * 0.02;

const covid19ImpactEstimator = (data) => {
  /* first challenge */

  const {

    region,
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds

  } = data;


  const period = timeToDays(periodType, timeToElapse);
  const periodFactor = Math.trunc(period / 3);
  const factor = 2 ** periodFactor;

  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  // Challenge one for impact cases
  const infectedImpact = currentlyInfected(reportedCases, 10);
  const requestedTimeImpact = infectionsByReqTime(infectedImpact, factor);

  output.impact.currentlyInfected = infectedImpact;
  output.impact.infectionsByRequestedTime = requestedTimeImpact;


  // Challenge one for severe cases
  const infectedSevere = currentlyInfected(reportedCases, 50);
  const requestedTimeSevere = infectionsByReqTime(infectedSevere, factor);

  output.severeImpact.currentlyInfected = infectedSevere;
  output.severeImpact.infectionsByRequestedTime = requestedTimeSevere;

  // Challenge two for impact cases

  const { impact, severeImpact } = output;

  const averageBedsOccupied = avgOccupiedBeds(totalHospitalBeds);
  const averageAvialableBeds = totalHospitalBeds - averageBedsOccupied;
  const severeCasesByReqTimeImpact = severeCasesByTime(impact.infectionsByRequestedTime);
  const hospitalBedsByReqTimeImpact = Math.trunc(averageAvialableBeds - severeCasesByReqTimeImpact);

  output.impact.severeCasesByRequestedTime = severeCasesByReqTimeImpact;
  output.impact.hospitalBedsByRequestedTime = hospitalBedsByReqTimeImpact;

  const severeCasesByReqTimeSevere = severeCasesByTime(severeImpact.infectionsByRequestedTime);
  const hospitalBedByReqTimeS = Math.trunc(averageAvialableBeds - severeCasesByReqTimeSevere);

  output.severeImpact.severeCasesByRequestedTime = severeCasesByReqTimeSevere;
  output.severeImpact.hospitalBedsByRequestedTime = hospitalBedByReqTimeS;

  /* Third challenge */

  // impact
  const casesForICUByReqTimeImpact = getCasesForICU(impact.infectionsByRequestedTime);
  const casesForVentByReqTimeI = getCasesforVentilator(impact.infectionsByRequestedTime);

  const dailyIncome = region.avgDailyIncomeInUSD;
  const incomePopulation = region.avgDailyIncomePopulation;

  // * populationIncome
  const hospitalizedImpact = impact.infectionsByRequestedTime;
  const y = hospitalizedImpact * incomePopulation * dailyIncome;
  const dollarsInFlightImpact = y / period;


  const roundUpImpact = Math.trunc(dollarsInFlightImpact);

  output.impact.casesForICUByRequestedTime = Math.trunc(casesForICUByReqTimeImpact);
  output.impact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVentByReqTimeI);
  output.impact.dollarsInFlight = roundUpImpact;

  // severe impact

  const casesForICUByReqTimeSevere = getCasesForICU(severeImpact.infectionsByRequestedTime);
  const casesForVBRTS = getCasesforVentilator(severeImpact.infectionsByRequestedTime);
  // const ibrtSevere = severeImpact.infectionsByRequestedTime;

  // * populationIncome
  const hospitalizedSevere = severeImpact.infectionsByRequestedTime;
  const z = hospitalizedSevere * incomePopulation * dailyIncome;
  const dollarsInFlightSevere = z / period;
  const roundUpSevere = Math.trunc(dollarsInFlightSevere);


  output.severeImpact.casesForICUByRequestedTime = Math.trunc(casesForICUByReqTimeSevere);
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVBRTS);
  output.severeImpact.dollarsInFlight = roundUpSevere;

  return output;
};

export default covid19ImpactEstimator;
