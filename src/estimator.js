const avgIncome = data.region.avgDailyIncomeInUSD
const currentlyInfected = () => data.reportedCase * 10;
const infectionsByRequestedTime = () => currentlyInfected * 1024;
const severeCasesByRequestedTime = () => 0.15 * infectionsByRequestedTime;
const hospitalBedsByRequestedTime = () => data.totalHospitalBeds - severeCasesByRequestedTime;
const casesForICUByRequestedTime = () => 0.5 * infectionsByRequestedTime;
const casesForVentilatorsByRequestedTime = () => 0.2 * infectionsByRequestedTime;
const dollarsInFlight = () => infectionsByRequestedTime * avgIncome * 30

const covid19ImpactEstimator = (data) => {
    const input = data;
    const avgIncome = data.region.avgDailyIncomeInUSD
    const currentlyInfected = () => data.reportedCase * 10;
    const infectionsByRequestedTime = () => currentlyInfected * 1024;
    const severeCasesByRequestedTime = () => 0.15 * infectionsByRequestedTime;
    const hospitalBedsByRequestedTime = () => data.totalHospitalBeds - severeCasesByRequestedTime;
    const casesForICUByRequestedTime = () => 0.5 * infectionsByRequestedTime;
    const casesForVentilatorsByRequestedTime = () => 0.2 * infectionsByRequestedTime;
    const dollarsInFlight = () => infectionsByRequestedTime * avgIncome * 30
    return{
        data: input,
        impact:{},
        severeImpact: {}
    }
};

export default covid19ImpactEstimator;
