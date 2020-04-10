import Impact from './classEstimators/impact';

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, periodType, timeToElapse, totalHospitalBeds
  } = data;
  const estimator = new Impact(reportedCases, periodType, timeToElapse, totalHospitalBeds);
  const output = {
    data,
    impact: {
      currentlyInfected: estimator.currentlyInfectedByRegion(10),
      infectionsByRequestedTime: estimator.infectedImpact()
    },
    severeImpact: {
      currentlyInfected: estimator.currentlyInfectedByRegion(50),
      infectionsByRequestedTime: estimator.infectedSevereImpact()
    }
  };

  return output;
};

export default covid19ImpactEstimator;
