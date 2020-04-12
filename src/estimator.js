const periodUtility = (periodType, periodCount) => {
  if (periodType === 'days') {
    return periodCount;
  }
  if (periodType === 'weeks') {
    return periodCount * 7;
  }
  if (periodType === 'months') {
    return periodCount * 30;
  }
  return periodCount;
};

const covid19ImpactEstimator = (data) => {
  /* first challenge */

  const {

    region,
    periodType,
    timeToElapse,
    reportedCases,
    // population,
    totalHospitalBeds

  } = data;


  const periodInDays = periodUtility(periodType, timeToElapse);

  const periodFactor = periodInDays / 3;

  const periodFactorTrunc = Math.trunc(periodFactor);

  const x = 2 ** periodFactorTrunc;

  const dataToBeReturned = {
    data: {},
    impact: {},
    severeImpact: {}
  };

  // data
  dataToBeReturned.data = data;

  // impact(first challenge)
  const currentlyInfectedImpact = reportedCases * 10;
  const infectionsByRequestedTimeImpact = currentlyInfectedImpact * x;

  dataToBeReturned.impact.currentlyInfected = currentlyInfectedImpact;
  dataToBeReturned.impact.infectionsByRequestedTime = infectionsByRequestedTimeImpact;


  // severe impact (first challenge)
  const currentlyInfectedSevere = reportedCases * 50;
  const infectionsByRequestedTimeSevere = currentlyInfectedSevere * x;

  dataToBeReturned.severeImpact.currentlyInfected = currentlyInfectedSevere;
  dataToBeReturned.severeImpact.infectionsByRequestedTime = infectionsByRequestedTimeSevere;

  /* end of first challenge */

  /* Second challenge */

  const { impact, severeImpact } = dataToBeReturned;

  const averageBedsOccupied = (totalHospitalBeds / 100) * 65;
  const averageAvialableBeds = totalHospitalBeds - averageBedsOccupied;


  // impact (second challenge)
  const severeCasesByReqTimeImpact = (impact.infectionsByRequestedTime / 100) * 15;
  const hospitalBedsByReqTimeImpact = averageAvialableBeds - severeCasesByReqTimeImpact;

  dataToBeReturned.impact.severeCasesByRequestedTime = Math.trunc(severeCasesByReqTimeImpact);
  dataToBeReturned.impact.hospitalBedsByRequestedTime = Math.trunc(hospitalBedsByReqTimeImpact);


  // severe impact(second challenge)
  const severeCasesByReqTimeSevere = (severeImpact.infectionsByRequestedTime / 100) * 15;
  const hospitalBedByReqTimeS = averageAvialableBeds - severeCasesByReqTimeSevere;

  dataToBeReturned.severeImpact.severeCasesByRequestedTime = Math.trunc(severeCasesByReqTimeSevere);
  dataToBeReturned.severeImpact.hospitalBedsByRequestedTime = Math.trunc(hospitalBedByReqTimeS);

  /* end of second challeg */

  /* Third challenge */

  // impact
  const casesForICUByReqTimeImpact = (impact.infectionsByRequestedTime / 100) * 5;
  const casesForVentByReqTimeI = (impact.infectionsByRequestedTime / 100) * 2;

  // const ibrtImpact = impact.infectionsByRequestedTime;
  const dailyIncome = region.avgDailyIncomeInUSD;
  const incomePopulation = region.avgDailyIncomePopulation;
  // const totalPopulation = population;

  // const populationIncome = incomePopulation * totalPopulation;

  // * populationIncome
  const hospitalizedImpact = impact.infectionsByRequestedTime;
  const y = hospitalizedImpact * incomePopulation * dailyIncome;
  const dollarsInFlightImpact = y / periodInDays;


  const roundUpImpact = Math.trunc(dollarsInFlightImpact);

  dataToBeReturned.impact.casesForICUByRequestedTime = Math.trunc(casesForICUByReqTimeImpact);
  dataToBeReturned.impact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVentByReqTimeI);
  dataToBeReturned.impact.dollarsInFlight = roundUpImpact;

  // severe impact

  const casesForICUByReqTimeSevere = (severeImpact.infectionsByRequestedTime / 100) * 5;
  const casesForVBRTS = (severeImpact.infectionsByRequestedTime / 100) * 2;
  // const ibrtSevere = severeImpact.infectionsByRequestedTime;

  // * populationIncome
  const hospitalizedSevere = severeImpact.infectionsByRequestedTime;
  const z = hospitalizedSevere * incomePopulation * dailyIncome;
  const dollarsInFlightSevere = z / periodInDays;
  const roundUpSevere = Math.trunc(dollarsInFlightSevere);


  dataToBeReturned.severeImpact.casesForICUByRequestedTime = Math.trunc(casesForICUByReqTimeSevere);
  dataToBeReturned.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVBRTS);
  dataToBeReturned.severeImpact.dollarsInFlight = roundUpSevere;

  return dataToBeReturned;
};

export default covid19ImpactEstimator;
