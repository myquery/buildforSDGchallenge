const covid19ImpactEstimator = (data) => {
    const input = data;
    const avgIncome = input.region.avgDailyIncomeInUSD
    const currentlyInfected = () => input.reportedCase * 10;
    const infectionsByRequestedTime = () => currentlyInfected * 1024;
    const severeCasesByRequestedTime = () => 0.15 * infectionsByRequestedTime;
    const hospitalBedsByRequestedTime = () => input.totalHospitalBeds - severeCasesByRequestedTime;
    const casesForICUByRequestedTime = () => 0.5 * infectionsByRequestedTime;
    const casesForVentilatorsByRequestedTime = () => 0.2 * infectionsByRequestedTime;
    const dollarsInFlight = () => infectionsByRequestedTime * avgIncome * 30
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
            currentlyInfected,
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
