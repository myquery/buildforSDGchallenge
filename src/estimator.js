const covid19ImpactEstimator = (data) => {
  const input = data;
  const avgIncome = input.region.avgDailyIncomeInUSD;
  const currentlyInfected = () => input.reportedCase * 10;
  const currentlySevereInfected = () => input.reportedCase * 50;
  const infectionsByRequestedTime = () => currentlyInfected * 1024;
  const severeCasesByRequestedTime = () => 0.15 * infectionsByRequestedTime;
  const hospitalBedsByRequestedTime = () => input.totalHospitalBeds - severeCasesByRequestedTime;
  const casesForICUByRequestedTime = () => 0.5 * infectionsByRequestedTime;
  const casesForVentilatorsByRequestedTime = () => 0.2 * infectionsByRequestedTime;
  const dollarsInFlight = () => {
        if(avgIncome > 1.5){
            return infectionsByRequestedTime * avgIncome * 30;
        }else{
            return   (infectionsByRequestedTime * 0.65) * avgIncome * 30;
        }
      
    }
  return{
    data: input,
    impact:{
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
        },
    severeImpact: {
        currentlySevereInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
        }
    }
};

export default covid19ImpactEstimator;
