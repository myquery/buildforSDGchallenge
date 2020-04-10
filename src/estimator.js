import Impact from './classEstimators/impact';

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, periodType, timeToElapse, totalHospitalBeds
  } = data;
  const estimator = new Impact(reportedCases, periodType, totalHospitalBeds, timeToElapse);
  const output = {
    data,
    impact: {
      currentlyInfected: estimator.currentlyInfectedByRegion(10),
      infectionsByRequestedTime: estimator.infectedImpact(),
      severeCasesByRequestedTime: estimator.severeCases(),
      hospitalBedsByRequestedTime: estimator.availableBedsPerHospital()
    },
    severeImpact: {
      currentlyInfected: estimator.currentlyInfectedByRegion(50),
      infectionsByRequestedTime: estimator.infectedSevereImpact(),
      severeCasesByRequestedTime: estimator.severeCases(),
      hospitalBedsByRequestedTime: estimator.availableBedsPerHospital()
    }
  };

  return output;
};

export default covid19ImpactEstimator;
