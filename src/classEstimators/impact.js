class Impact {
  constructor(cases, time, beds, elapseTime, avgIncome, avgPolution) {
    this.cases = cases;
    this.time = time;
    this.beds = beds;
    this.elapseTime = elapseTime;
    this.avgIncome = avgIncome;
    this.avgPolution = avgPolution;
  }

  // Estimate the number per period of time
  timeToDays() {
    let days;
    if (this.time === 'days') {
      if (this.elapseTime > 2) {
        days = Math.trunc(this.elapseTime / 3);
      } else {
        days = 1;
      }
    }
    if (this.time === 'weeks') {
      const toDays = this.elapseTime * 7;
      days = Math.trunc(toDays / 3);
    }
    if (this.time === 'months') {
      const toDays = this.elapseTime * 30;
      days = Math.trunc(toDays / 3);
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
    return Math.trunc(this.currentlyInfectedByRegion(10) * (2 ** timed));
  }

  // Compute infected severe impact per time
  infectedSevereImpact() {
    const timed = this.timeToDays();
    return Math.trunc(this.currentlyInfectedByRegion(50) * (2 ** timed));
  }

  // Compute value for severeCasesByRequestedTime for Impact
  impactCases() {
    const infected = this.infectedImpact();
    return Math.trunc(infected * 0.15);
  }

  // Compute value for severeCasesByRequestedTime for severe cases
  severeCases() {
    const infected = this.infectedSevereImpact();
    return Math.trunc(infected * 0.15);
  }

  // Compute value for available beds per hospital
  availableBedsPerHospitalForImpact() {
    // const timed = this.timeToDays();
    // const capacity = this.beds * 0.95;
    // const availableBedsForSevereCases = capacity * 0.35;
    const hospitalSevereCases = this.impactCases();
    return Math.trunc(this.beds - hospitalSevereCases);
  }

  // Compute value for available beds per hospital
  availableBedsPerHospitalForSevere() {
    // const timed = this.timeToDays();
    // const capacity = this.beds * 0.95;
    // const availableBedsForSevereCases = capacity * 0.35;
    const hospitalSevereCases = this.severeCases();
    return Math.trunc(this.beds - hospitalSevereCases);
  }

  // compute value for ICU patients
  impactRequiredICU() {
    const infected = this.infectedImpact();
    return Math.trunc(0.05 * infected);
  }

  // compute value for ICU patients
  severeRequiredICU() {
    const infected = this.infectedSevereImpact();
    return Math.trunc(0.05 * infected);
  }

  // compute value for required ventilators
  impactCasesRequiredVentilator() {
    const infected = this.infectedImpact();
    return Math.trunc(0.02 * infected);
  }

  // compute value for required ventilators
  severeCasesRequiredVentilator() {
    const infected = this.infectedSevereImpact();
    return Math.trunc(0.02 * infected);
  }

  // compute dollar in flight to measure economic impact
  getDollarsInFlightForImpactCases() {
    const timed = this.timeToDays();
    const infected = this.infectedImpact();
    const economyLoseForImpactCases = infected * this.avgIncome * this.avgPolution * timed;
    return economyLoseForImpactCases;
  }

  // compute dollar in flight to measure economic impact
  getDollarsInFlightForSevereCases() {
    const timed = this.timeToDays();
    const infected = this.infectedSevereImpact();
    const economyLoseForSevereCases = infected * this.avgIncome * this.avgPolution * timed;
    return economyLoseForSevereCases;
  }
}

export default Impact;
