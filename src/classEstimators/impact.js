/* eslint-disable import/prefer-default-export */
export default class Impact {
  constructor(cases, time, beds, elapseTime) {
    this.cases = cases;
    this.time = time;
    this.beds = beds;
    this.elapseTime = elapseTime;
  }

  // Estimate the number per period of time
  timeToDays() {
    let days;
    if (this.time === 'days') {
      if (this.elapseTime > 2) {
        days = Math.floor(this.elapseTime / 3);
      } else {
        days = 1;
      }
    }
    if (this.time === 'weeks') {
      const toDays = this.elapseTime * 7;
      days = Math.floor(toDays / 3);
    }
    if (this.time === 'months') {
      const toDays = this.elapseTime * 30;
      days = Math.floor(toDays / 3);
    }
    return days;
  }

  // Compute currently Infected with covid-19 per region
  currentlyInfectedByRegion(multiply) {
    return Math.trunc(this.cases * multiply);
  }

  // Compute infected impact per time
  infectedImpact() {
    const timed = this.timeToDays();
    return Math.floor(this.currentlyInfectedByRegion(10) * (2 ** timed));
  }

  // Compute infected severe impact per time
  infectedSevereImpact() {
    const timed = this.timeToDays();
    return Math.floor(this.currentlyInfectedByRegion(50) * (2 ** timed));
  }

  // Compute value for severeCasesByRequestedTime for Impact
  severeCases() {
    return Math.round(this.infectedImpact() * 0.15);
  }

  // Compute value for available beds per hospital
  availableBedsPerHospital() {
    const timed = this.timeToDays();
    // const occupied = Math.round(this.beds * 0.65);
    const availableBeds = Math.round(this.beds * 0.95);
    const availableBedsForSevereCases = Math.round(availableBeds * 0.35);
    const hospitalSevereCases = this.severeCases() * (2 ** timed);
    return (availableBedsForSevereCases - hospitalSevereCases);
  }
}
