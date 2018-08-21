const RequestCreator = require("./RequestCreator");

class FBI_Wrapper {

  constructor(userAPIkey) {
    this.request = new RequestCreator(userAPIkey);
  }

  //returns object w/ properties states w/ properties ori w/ properties of each agency
  getAgencies() {
    return this.request.getAgencies();
  }

  //NOTE: Page Number is always an optional parameter
  //TODO: Maybe add checks to see if parameter types are correct (numbers, etc)

  //Should empty param be allowed? Makes same call as getAgencies then
  getAgencyByORI(ori) {
    return this.request.getAgencies("ori", ori);
  }

  getAgenciesByState(stateAbbreviation, pageNumber = 0) {
    return this.request.getAgencies("state", stateAbbreviation, pageNumber);
  }

  getStates(pageNumber = 0) {
    return this.request.getStates("", pageNumber);
  }

  getStateByAbbreviation(stateAbbreviation) {
    return this.request.getStates(stateAbbreviation, pageNumber);
  }

  getPoliceByORI(ori) {
    return this.request.getPoliceEmployment("agencies", ori);
  }

  getPoliceByNation() {
    return this.request.getPoliceEmployment();
  }

  //TODO: Allow functionality with string number?
  getPoliceByRegion(region) {
    if (typeof region == "number") {
      switch(region) {
        case(0):
          return this.request.getPoliceEmployment("regions", "U.S. Territories");
          break;
        case(1):
          return this.request.getPoliceEmployment("regions", "Northeast");
          break;
        case(2):
          return this.request.getPoliceEmployment("regions", "Midwest");
          break;
        case(3):
          return this.request.getPoliceEmployment("regions", "South");
          break;
        case(4):
          return this.request.getPoliceEmployment("regions", "West");
          break;
        case(99):
          return this.request.getPoliceEmployment("regions", "Other");
          break;
      }
    }
    else return this.request.getPoliceEmployment("regions", region);
  }

  getPoliceByState(stateAbbreviation) {
    return this.request.getPoliceEmployment("states", stateAbbreviation);
  }

  getCrimesByORI(ori, specificOffense = "offenses") {
    return this.request.getCrimeSummary(ori, specificOffense);
  }

  //TODO: Look into seeing if offense / classification can be made optional
  //TODO: Check how to ensure that # of params matches # of params of function (make errors easier for user)
  getVictimsByORI(ori, offense, classification) {
    return this.request.getVictims("agencies", offense, classification, ori);
  }

  getVictimsByNation(offense, classification) {
    return this.request.getVictims("national", offense, classification);
  }

  //TODO: Allow region codes?
  getVictimsByRegion(regionName, offense, classification) {
    return this.request.getVictims("regions", offense, classification, regionName);
  }

  getVictimsByState(stateAbbreviation, offense, classification) {
    return this.request.getVictims("states", offense, classification, stateAbbreviation)
  }

}

module.exports = FBI_Wrapper;
