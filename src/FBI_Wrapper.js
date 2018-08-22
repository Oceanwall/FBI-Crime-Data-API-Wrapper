const RequestCreator = require("./RequestCreator");

//NOTE: General parameter layouts: relevantInformation, offenseInformation, classificationInformation, pageNumber
//NOTE: Page Number is an optional parameter
//NOTE: Method layout is as follows (Larger Scope -> Smaller Scope)
/* Constructor,
   get agencies,
   get states,
   get regions,
   get police employment,
   get victims,
   get offenders,
   get crime frequencies,
   get detailed crime stats (ORI and arson only),
   get UCR participation,
   get crime estimates
*/

//TODO: Add custom functionalities?
//TODO: Maybe add checks to see if parameter types are correct? (numbers, etc)

const NATIONAL_SCOPE = "national";
const REGIONAL_SCOPE = "regions";
const STATE_SCOPE = "states";
const ORI_SCOPE = "agencies";

class FBI_Wrapper {

  constructor(userAPIkey, strictErrorChecking = true) {
    this.request = new RequestCreator(userAPIkey, strictErrorChecking);
  }

  //Get agencies

  getAgencies() {
    this.request.checkParameters(arguments.length, this.getAgencies);
    return this.request.getAgencies();
  }

  getAgenciesByState(stateAbbreviation, pageNumber = 0) {
    return this.request.getAgencies("state", stateAbbreviation, pageNumber);
  }

  //If empty param, then makes same call as getAgencies then
  getAgencyByORI(ori = "") {
    return this.request.getAgencies("ori", ori);
  }

  //Get states

  getStates(pageNumber = 0) {
    return this.request.getStates("", pageNumber);
  }

  getStateByAbbreviation(stateAbbreviation) {
    this.request.checkParameters(arguments.length, this.getStateByAbbreviation);
    return this.request.getStates(stateAbbreviation);
  }

  //Get regions

  getRegions() {
    this.request.checkParameters(arguments.length, this.getPoliceBgetRegionsyORI);
    return this.request.getRegions();
  }

  getRegionsByName(regionName) {
    this.request.checkParameters(arguments.length, this.getRegionsByName);
    if (typeof regionName == "number") {
      regionName = this.request.convertRegionNumberToRegionName(regionName);
    }
    return this.request.getRegions(regionName);
  }

  //Get police employment statistics

  getPoliceByNation() {
    return this.request.getPoliceEmployment();
  }

  getPoliceByRegion(regionName) {
    this.request.checkParameters(arguments.length, this.getPoliceByRegion);
    if (typeof regionName == "number") {
      regionName = this.request.convertRegionNumberToRegionName(regionName);
    }
    return this.request.getPoliceEmployment(REGIONAL_SCOPE, regionName);
  }

  getPoliceByState(stateAbbreviation) {
    this.request.checkParameters(arguments.length, this.getPoliceByState);
    return this.request.getPoliceEmployment(STATE_SCOPE, stateAbbreviation);
  }

  getPoliceByORI(ori) {
    this.request.checkParameters(arguments.length, this.getPoliceByORI);
    return this.request.getPoliceEmployment(ORI_SCOPE, ori);
  }

  //Get victim demographic statistics

  getVictimsByNation(offense, classification) {
    this.request.checkParameters(arguments.length, this.getVictimsByNation);
    return this.request.getParticipants("victim", NATIONAL_SCOPE, offense, classification);
  }

  //TODO: Allow region codes?
  getVictimsByRegion(regionName, offense, classification) {
    this.request.checkParameters(arguments.length, this.getVictimsByRegion);
    return this.request.getParticipants("victim", REGIONAL_SCOPE, offense, classification, regionName);
  }

  getVictimsByState(stateAbbreviation, offense, classification) {
    this.request.checkParameters(arguments.length, this.getVictimsByState);
    return this.request.getParticipants("victim", STATE_SCOPE, offense, classification, stateAbbreviation)
  }

  getVictimsByORI(ori, offense, classification) {
    this.request.checkParameters(arguments.length, this.getVictimsByORI);
    return this.request.getParticipants("victim", ORI_SCOPE, offense, classification, ori);
  }

  //Get offender demographic statistics

  getOffendersByNation(offense, classification) {
    this.request.checkParameters(arguments.length, this.getOffendersByNation);
    return this.request.getParticipants("offender", NATIONAL_SCOPE, offense, classification);
  }

  getOffendersByRegion(regionName, offense, classification) {
    this.request.checkParameters(arguments.length, this.getOffendersByRegion);
    return this.request.getParticipants("offender", REGIONAL_SCOPE, offense, classification, regionName);
  }

  getOffendersByState(stateAbbreviation, offense, classification) {
    this.request.checkParameters(arguments.length, this.getOffendersByState);
    return this.request.getParticipants("offender", STATE_SCOPE, offense, classification, stateAbbreviation)
  }

  getOffendersByORI(ori, offense, classification) {
    this.request.checkParameters(arguments.length, this.getOffendersByORI);
    return this.request.getParticipants("offender", ORI_SCOPE, offense, classification, ori);
  }

  //Get crime frequency statistics

  getCrimeCountByNation(offense) {
    this.request.checkParameters(arguments.length, this.getCrimeCountByNation);
    return this.request.getCrimeCount(NATIONAL_SCOPE, offense);
  }

  getCrimeCountByRegion(regionName, offense) {
    this.request.checkParameters(arguments.length, this.getCrimeCountByRegion);
    return this.request.getCrimeCount(REGIONAL_SCOPE, offense, regionName);
  }

  getCrimeCountByState(stateAbbreviation, offense) {
    this.request.checkParameters(arguments.length, this.getCrimeCountByState);
    return this.request.getCrimeCount(STATE_SCOPE, offense, stateAbbreviation);
  }

  getCrimeCountByORI(ori, offense) {
    this.request.checkParameters(arguments.length, this.getCrimeCountByORI);
    return this.request.getCrimeCount(ORI_SCOPE, offense, ori);
  }

  getCrimesByORI(ori, offense = "offenses") {
    return this.request.getCrimeSummary(ori, offense);
  }

  //Get detailed arson statistics

  getDetailedArsonStatsByNation() {
    this.request.checkParameters(arguments.length, this.getDetailedArsonStatsByNation);
    return this.request.getArsonStats(NATIONAL_SCOPE);
  }

  getDetailedArsonStatsByRegion(regionName) {
    this.request.checkParameters(arguments.length, this.getDetailedArsonStatsByRegion);
    return this.request.getArsonStats(REGIONAL_SCOPE, regionName);
  }

  getDetailedArsonStatsByState(stateAbbreviation) {
    this.request.checkParameters(arguments.length, this.getDetailedArsonStatsByState);
    return this.request.getArsonStats(STATE_SCOPE, stateAbbreviation);
  }

  //Get participation statistics (with UCR)

  getParticipationByNation() {
    this.request.checkParameters(arguments.length, this.getParticipationByNation);
    return this.request.getAgencyParticipation(NATIONAL_SCOPE);
  }

  getParticipationByRegion(regionName) {
    this.request.checkParameters(arguments.length, this.getParticipationByRegion);
    return this.request.getAgencyParticipation(REGIONAL_SCOPE, regionName);
  }

  getParticipationByState(stateAbbreviation) {
    this.request.checkParameters(arguments.length, this.getParticipationByState);
    return this.request.getAgencyParticipation(STATE_SCOPE, stateAbbreviation);
  }

  getParticipationByORI(ori) {
    this.request.checkParameters(arguments.length, this.getParticipationByORI);
    return this.request.getAgencyParticipation(ORI_SCOPE, ori)
  }

  //Get crime estimates

  getCrimeEstimatesByNation() {
    this.request.checkParameters(arguments.length, this.getCrimeEstimatesByNation);
    return this.request.getEstimates(NATIONAL_SCOPE);
  }

  getCrimeEstimatesByRegion(regionName) {
    this.request.checkParameters(arguments.length, this.getCrimeEstimatesByRegion);
    return this.request.getEstimates(REGIONAL_SCOPE, regionName);
  }

  getCrimeEstimatesByState(stateAbbreviation) {
    this.request.checkParameters(arguments.length, this.getCrimeEstimatesByState);
    return this.request.getEstimates(STATE_SCOPE, stateAbbreviation);
  }

}

module.exports = FBI_Wrapper;
