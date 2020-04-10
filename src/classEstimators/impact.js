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
    return Math.floor(this.currentlyInfectedByRegion(10) * (2 ** this.timeToDays));
  }

  // Compute infected severe impact per time
  infectedSevereImpact() {
    return Math.floor(this.currentlyInfectedByRegion(50) * (2 ** this.timeToDays));
  }
}
