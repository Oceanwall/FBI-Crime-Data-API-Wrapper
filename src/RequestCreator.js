const fetch = require('node-fetch');

const ErrorChecker = require("./ErrorChecker");
const check = new ErrorChecker();

const BASE_URL = "https://api.usa.gov/crime/fbi/sapi/api/";


class RequestCreator {

  constructor(userAPIkey) {
    check.exists(userAPIkey, "API Key");
    this.userAPIkey = `api_key=${userAPIkey}`;
  }

  convertRegionNumberToRegionName(regionNumber) {
    switch(regionNumber) {
      case(0):
        return "U.S. Territories";
        break;
      case(1):
        return "Northeast";
        break;
      case(2):
        return "Midwest";
        break;
      case(3):
        return "South";
        break;
      case(4):
        return "West";
        break;
      case(99):
        return "Other";
        break;
    }
  }

  getAgencies(type = "default", relevantInfo = "", pageNumber = 0) {
    //This check isn't necessary?
    check.exists(type, "Agencies GET request criteria");

    switch(type) {
      case "default":
        return RequestCreator.GETrequest(`${BASE_URL}agencies?${this.userAPIkey}`);
        break;
      case "ori":
        return RequestCreator.GETrequest(`${BASE_URL}agencies/${relevantInfo}?${this.userAPIkey}&page=${pageNumber}`);
        break;
      case "state":
        return RequestCreator.GETrequest(`${BASE_URL}agencies/byStateAbbr/${relevantInfo}?${this.userAPIkey}&page=${pageNumber}`);
        break;
      default:
        check.invalidParams("getAgencies");
        break;
    }

    //additional error handling in case a getAgencies call somehow gets through?
  }

  getStates(stateAbbreviation = "", pageNumber = 0) {
    return RequestCreator.GETrequest(`${BASE_URL}states/${stateAbbreviation}?${this.userAPIkey}&page=${pageNumber}`);
  }

  getRegions(regionName = "") {
    return RequestCreator.GETrequest(`${BASE_URL}regions/${regionName}?${this.userAPIkey}`);
  }

  getPoliceEmployment(scope = "national", relevantInfo = "") {
    return RequestCreator.GETrequest(`${BASE_URL}police-employment/${scope}/${relevantInfo}?${this.userAPIkey}`);
  }

  getCrimeSummary(ori, offense) {
    return RequestCreator.GETrequest(`${BASE_URL}summarized/agencies/${ori}/${offense}?${this.userAPIkey}`);
  }

  getParticipants(type, scope, offense, classification, relevantInfo) {
    if (scope == "national") {
      return RequestCreator.GETrequest(`${BASE_URL}nibrs/${offense}/${type}/${scope}/${classification}?${this.userAPIkey}`);
    }
    else return RequestCreator.GETrequest(`${BASE_URL}nibrs/${offense}/${type}/${scope}/${relevantInfo}/${classification}?${this.userAPIkey}`);
  }

  getCrimeCount(scope, offense, relevantInfo = "") {
    return this.getParticipants("offense", scope, offense, "count", relevantInfo);
  }

  // Detailed stats offered only for arson...
  getArsonStats(scope, relevantInfo = "") {
    return RequestCreator.GETrequest(`${BASE_URL}arson/${scope}/${relevantInfo}?${this.userAPIkey}`);
  }

  getAgencyParticipation(scope, relevantInfo = "") {
    return RequestCreator.GETrequest(`${BASE_URL}participation/${scope}/${relevantInfo}?${this.userAPIkey}`);
  }

  getEstimates(scope, relevantInfo = "") {
    return RequestCreator.GETrequest(`${BASE_URL}estimates/${scope}/${relevantInfo}?${this.userAPIkey}`);
  }

  static GETrequest(targetURL) {
    return new Promise((resolve, reject) => {
      fetch(targetURL).then((result) => {
        return result.json();
      }).then((body) => {
        resolve(body);
      });
    });
  }


}

module.exports = RequestCreator;
