// eslint-disable-next-line import/extensions
import covid19ImpactEstimator from './estimator.js';

const goEstimate = () => {
  const population = document.querySelector('input[name="population"]').value;
  const reportedCases = document.querySelector('input[name="reportedCases"]').value;
  const totalHospitalBeds = document.querySelector('input[name="totalHospitalBeds"]').value;
  const periodType = document.querySelector('select[name="periodType"]').value;
  const timeToElapse = document.querySelector('input[name="timeToElapse"]').value;

  const data = {
    region: {
      name: 'africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71
    },
    periodType,
    timeToElapse: parseInt(timeToElapse, 10),
    reportedCases: parseInt(reportedCases, 10),
    population: parseInt(population, 10),
    totalHospitalBeds: parseInt(totalHospitalBeds, 10)
  };

  // eslint-disable-next-line no-console
  console.log(covid19ImpactEstimator(data));
};

const onSubmited = () => {
  document.querySelector('#data-go-estimate').onclick = () => goEstimate();
};
window.onload = onSubmited;
