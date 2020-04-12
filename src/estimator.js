class Impact {
  constructor(cases, periodType, beds, elapseTime, avgIncome, avgPolution) {
    this.cases = cases;
    this.periodType = periodType;
    this.beds = beds;
    this.elapseTime = elapseTime;
    this.avgIncome = avgIncome;
    this.avgPolution = avgPolution;
  }

  timeToDays() {
    let days;
    if (this.periodType === 'days') {
      return days;
    }
    if (this.periodType === 'weeks') {
      return days * 7;
    }
    if (this.periodType === 'months') {
      return days * 30;
    }
    return days;
  }

  currentlyInfectedByRegion(multiply) {
    return this.cases * multiply;
  }
}

const covid19ImpactEstimator = (data) => {
  /* first challenge */

  const {

    region,
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds

  } = data;

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  const estimator = new Impact(
    reportedCases,
    periodType,
    totalHospitalBeds,
    timeToElapse,
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation


  );

  const periodInDays = estimator.timeToDays(periodType, timeToElapse);
  const periodFactor = periodInDays / 3;
  const periodFactorTrunc = Math.trunc(periodFactor);
  const factor = 2 ** periodFactorTrunc;

  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  // impact(first challenge)
  const currentlyInfectedImpact = estimator.currentlyInfectedByRegion(10);
  const infectionsByRequestedTimeImpact = currentlyInfectedImpact * factor;

  output.impact.currentlyInfected = currentlyInfectedImpact;
  output.impact.infectionsByRequestedTime = infectionsByRequestedTimeImpact;


  // severe impact (first challenge)
  const currentlyInfectedSevere = reportedCases * 50;
  const infectionsByRequestedTimeSevere = currentlyInfectedSevere * factor;

  output.severeImpact.currentlyInfected = currentlyInfectedSevere;
  output.severeImpact.infectionsByRequestedTime = infectionsByRequestedTimeSevere;

  /* end of first challenge */

  /* Second challenge */

  const { impact, severeImpact } = output;

  const averageBedsOccupied = (totalHospitalBeds / 100) * 65;
  const averageAvialableBeds = totalHospitalBeds - averageBedsOccupied;


  // impact (second challenge)
  const severeCasesByReqTimeImpact = (impact.infectionsByRequestedTime / 100) * 15;
  const hospitalBedsByReqTimeImpact = averageAvialableBeds - severeCasesByReqTimeImpact;

  output.impact.severeCasesByRequestedTime = Math.trunc(severeCasesByReqTimeImpact);
  output.impact.hospitalBedsByRequestedTime = Math.trunc(hospitalBedsByReqTimeImpact);


  // severe impact(second challenge)
  const severeCasesByReqTimeSevere = (severeImpact.infectionsByRequestedTime / 100) * 15;
  const hospitalBedByReqTimeS = averageAvialableBeds - severeCasesByReqTimeSevere;

  output.severeImpact.severeCasesByRequestedTime = Math.trunc(severeCasesByReqTimeSevere);
  output.severeImpact.hospitalBedsByRequestedTime = Math.trunc(hospitalBedByReqTimeS);

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

  output.impact.casesForICUByRequestedTime = Math.trunc(casesForICUByReqTimeImpact);
  output.impact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVentByReqTimeI);
  output.impact.dollarsInFlight = roundUpImpact;

  // severe impact

  const casesForICUByReqTimeSevere = (severeImpact.infectionsByRequestedTime / 100) * 5;
  const casesForVBRTS = (severeImpact.infectionsByRequestedTime / 100) * 2;
  // const ibrtSevere = severeImpact.infectionsByRequestedTime;

  // * populationIncome
  const hospitalizedSevere = severeImpact.infectionsByRequestedTime;
  const z = hospitalizedSevere * incomePopulation * dailyIncome;
  const dollarsInFlightSevere = z / periodInDays;
  const roundUpSevere = Math.trunc(dollarsInFlightSevere);


  output.severeImpact.casesForICUByRequestedTime = Math.trunc(casesForICUByReqTimeSevere);
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(casesForVBRTS);
  output.severeImpact.dollarsInFlight = roundUpSevere;

  return output;
};

export default covid19ImpactEstimator;
