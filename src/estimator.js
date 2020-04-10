import Impact from './classEstimators/impact';


const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = data;

  const impactEstimators = new Impact(reportedCases, periodType, totalHospitalBeds, timeToElapse);
  const output = {
    data,
    impact: {
      currentlyInfected: impactEstimators.currentlyInfectedByRegion(10),
      infectionsByRequestedTime: impactEstimators.infectedImpact()
    },
    severeImpact: {
      currentlyInfected: impactEstimators.currentlyInfectedByRegion(50),
      infectionsByRequestedTime: impactEstimators.infectedSevereImpact()
    }
  };


  return output;
};

export default covid19ImpactEstimator;
