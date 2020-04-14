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
const infectionsByReqTime = (infected, factor) => Math.trunc(infected * factor);
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

  const avgBedsOccupied = avgOccupiedBeds(totalHospitalBeds);
  const avgAvialableBeds = totalHospitalBeds - avgBedsOccupied;
  const dataFromImpactInfected = impact.infectionsByRequestedTime;
  const impactCasesByRequestedTime = severeCasesByTime(dataFromImpactInfected);
  const requestedHospitalBeds = Math.trunc(avgAvialableBeds - impactCasesByRequestedTime);

  output.impact.severeCasesByRequestedTime = impactCasesByRequestedTime;
  output.impact.hospitalBedsByRequestedTime = requestedHospitalBeds;

  const dataFromSevereInfected = severeImpact.infectionsByRequestedTime;
  const severeCasesByReqTimeSevere = severeCasesByTime(dataFromSevereInfected);
  const hospitalBedByReqTimeS = Math.trunc(avgAvialableBeds - severeCasesByReqTimeSevere);

  output.severeImpact.severeCasesByRequestedTime = severeCasesByReqTimeSevere;
  output.severeImpact.hospitalBedsByRequestedTime = hospitalBedByReqTimeS;

  // Challenge three for impact cases

  const casesForICUByTimeImpact = getCasesForICU(impact.infectionsByRequestedTime);
  const casesForVentTimeImpact = getCasesforVentilator(impact.infectionsByRequestedTime);

  const dailyIncomePerRegion = region.avgDailyIncomeInUSD;
  const incomePopulationPerRegion = region.avgDailyIncomePopulation;

  const hospitalizedImpact = impact.infectionsByRequestedTime;
  const economyLoss = hospitalizedImpact * incomePopulationPerRegion * dailyIncomePerRegion;
  const dollarsInFlightImpact = Math.trunc(economyLoss / period);


  output.impact.casesForICUByRequestedTime = Math.trunc(casesForICUByTimeImpact);
  output.impact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVentTimeImpact);
  output.impact.dollarsInFlight = dollarsInFlightImpact;

  const casesForICUByReqTimeSevere = getCasesForICU(severeImpact.infectionsByRequestedTime);
  const casesForVBRTS = getCasesforVentilator(severeImpact.infectionsByRequestedTime);

  // * populationIncome
  const hospitalizedSevere = severeImpact.infectionsByRequestedTime;
  const moneyLost = hospitalizedSevere * incomePopulationPerRegion * dailyIncomePerRegion;
  const dollarsInFlightSevere = Math.trunc(moneyLost / period);

  output.severeImpact.casesForICUByRequestedTime = Math.trunc(casesForICUByReqTimeSevere);
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVBRTS);
  output.severeImpact.dollarsInFlight = dollarsInFlightSevere;

  return output;
};

export default covid19ImpactEstimator;
