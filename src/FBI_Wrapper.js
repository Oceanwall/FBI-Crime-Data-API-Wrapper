const RequestCreator = require("./RequestCreator");

//TODO: Standardize parameter layouts?
//TODO: Standardize order of methods, add custom functionalities?

const NATIONAL_SCOPE = "national";
const REGIONAL_SCOPE = "regions";
const STATE_SCOPE = "states";
const ORI_SCOPE = "agencies";

class FBI_Wrapper {

  constructor(userAPIkey) {
    this.request = new RequestCreator(userAPIkey);
  }

  //returns object w/ properties states w/ properties ori w/ properties of each agency
  getAgencies() {
    return this.request.getAgencies();
  }

  //NOTE: Page Number is an optional parameter
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
    return this.request.getStates(stateAbbreviation);
  }

  getRegions() {
    return this.request.getRegions();
  }

  getRegionsByName(regionName) {
    if (typeof regionName == "number") {
      regionName = this.request.convertRegionNumberToRegionName(regionName);
    }
    return this.request.getRegions(regionName);
  }

  getPoliceByORI(ori) {
    return this.request.getPoliceEmployment(ORI_SCOPE, ori);
  }

  getPoliceByNation() {
    return this.request.getPoliceEmployment();
  }

  getPoliceByRegion(regionName) {
    if (typeof regionName == "number") {
      regionName = this.request.convertRegionNumberToRegionName(regionName);
    }
    return this.request.getPoliceEmployment(REGIONAL_SCOPE, regionName);
  }

  getPoliceByState(stateAbbreviation) {
    return this.request.getPoliceEmployment(STATE_SCOPE, stateAbbreviation);
  }

  getCrimesByORI(ori, offense = "offenses") {
    return this.request.getCrimeSummary(ori, offense);
  }

  //TODO: Look into seeing if offense / classification can be made optional
  //TODO: Check how to ensure that # of params matches # of params of function (make errors easier for user)
  getVictimsByORI(ori, offense, classification) {
    return this.request.getParticipants("victim", ORI_SCOPE, offense, classification, ori);
  }

  getVictimsByNation(offense, classification) {
    return this.request.getParticipants("victim", NATIONAL_SCOPE, offense, classification);
  }

  //TODO: Allow region codes?
  getVictimsByRegion(regionName, offense, classification) {
    return this.request.getParticipants("victim", REGIONAL_SCOPE, offense, classification, regionName);
  }

  getVictimsByState(stateAbbreviation, offense, classification) {
    return this.request.getParticipants("victim", STATE_SCOPE, offense, classification, stateAbbreviation)
  }

  getOffendersByORI(ori, offense, classification) {
    return this.request.getParticipants("offender", ORI_SCOPE, offense, classification, ori);
  }

  getOffendersByNation(offense, classification) {
    return this.request.getParticipants("offender", NATIONAL_SCOPE, offense, classification);
  }

  getOffendersByRegion(regionName, offense, classification) {
    return this.request.getParticipants("offender", REGIONAL_SCOPE, offense, classification, regionName);
  }

  getOffendersByState(stateAbbreviation, offense, classification) {
    return this.request.getParticipants("offender", STATE_SCOPE, offense, classification, stateAbbreviation)
  }

  getCrimeCountByNation(offense) {
    return this.request.getCrimeCount(NATIONAL_SCOPE, offense);
  }

  getCrimeCountByRegion(regionName, offense) {
    return this.request.getCrimeCount(REGIONAL_SCOPE, offense, regionName);
  }

  getCrimeCountByState(stateAbbreviation, offense) {
    return this.request.getCrimeCount(STATE_SCOPE, offense, stateAbbreviation);
  }

  //Add own crime stat method? Automatically gets crime related to certain ORI?
  getCrimeCountByORI(ori, offense) {
    return this.request.getCrimeCount(ORI_SCOPE, offense, ori);
  }

  getDetailedArsonStatsByNation() {
    return this.request.getArsonStats(NATIONAL_SCOPE);
  }

  getDetailedArsonStatsByRegion(regionName) {
    return this.request.getArsonStats(REGIONAL_SCOPE, regionName);
  }

  getDetailedArsonStatsByState(stateAbbreviation) {
    return this.request.getArsonStats(STATE_SCOPE, stateAbbreviation);
  }

  getParticipationByORI(ori) {
    return this.request.getAgencyParticipation(ORI_SCOPE, ori)
  }

  getParticipationByState(stateAbbreviation) {
    return this.request.getAgencyParticipation(STATE_SCOPE, stateAbbreviation);
  }

  getParticipationByRegion(regionName) {
    return this.request.getAgencyParticipation(REGIONAL_SCOPE, regionName);
  }

  getParticipationByNation() {
    return this.request.getAgencyParticipation(NATIONAL_SCOPE);
  }

  getCrimeEstimatesByNation() {
    return this.request.getEstimates(NATIONAL_SCOPE);
  }

  getCrimeEstimatesByRegion(regionName) {
    return this.request.getEstimates(REGIONAL_SCOPE, regionName);
  }

  getCrimeEstimatesByState(stateAbbreviation) {
    return this.request.getEstimates(STATE_SCOPE, stateAbbreviation);
  }



}

module.exports = FBI_Wrapper;
