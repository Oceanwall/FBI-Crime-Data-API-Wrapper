const RequestCreator = require("./RequestCreator");

//TODO: Constants for some of the strings?
//TODO: Standardize parameter layouts?
//TODO: Standardize order of methods, add custom functionalities?

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

  getCrimesByORI(ori, offense = "offenses") {
    return this.request.getCrimeSummary(ori, offense);
  }

  //TODO: Look into seeing if offense / classification can be made optional
  //TODO: Check how to ensure that # of params matches # of params of function (make errors easier for user)
  getVictimsByORI(ori, offense, classification) {
    return this.request.getParticipants("victim", "agencies", offense, classification, ori);
  }

  getVictimsByNation(offense, classification) {
    return this.request.getParticipants("victim", "national", offense, classification);
  }

  //TODO: Allow region codes?
  getVictimsByRegion(regionName, offense, classification) {
    return this.request.getParticipants("victim", "regions", offense, classification, regionName);
  }

  getVictimsByState(stateAbbreviation, offense, classification) {
    return this.request.getParticipants("victim", "states", offense, classification, stateAbbreviation)
  }

  getOffendersByORI(ori, offense, classification) {
    return this.request.getParticipants("offender", "agencies", offense, classification, ori);
  }

  getOffendersByNation(offense, classification) {
    return this.request.getParticipants("offender", "national", offense, classification);
  }

  getOffendersByRegion(regionName, offense, classification) {
    return this.request.getParticipants("offender", "regions", offense, classification, regionName);
  }

  getOffendersByState(stateAbbreviation, offense, classification) {
    return this.request.getParticipants("offender", "states", offense, classification, stateAbbreviation)
  }

  getCrimeCountByNation(offense) {
    return this.request.getCrimeCount("national", offense);
  }

  getCrimeCountByRegion(regionName, offense) {
    return this.request.getCrimeCount("regions", offense, regionName);
  }

  getCrimeCountByState(stateAbbreviation, offense) {
    return this.request.getCrimeCount("states", offense, stateAbbreviation);
  }

  //Add own crime stat method? Automatically gets crime related to certain ORI?
  getCrimeCountByORI(ori, offense) {
    return this.request.getCrimeCount("agencies", offense, ori);
  }

  getDetailedArsonStatsByNation() {
    return this.request.getArsonStats("national");
  }

  getDetailedArsonStatsByRegion(regionName) {
    return this.request.getArsonStats("regions", regionName);
  }

  getDetailedArsonStatsByState(stateAbbreviation) {
    return this.request.getArsonStats("states", stateAbbreviation);
  }



}

module.exports = FBI_Wrapper;
