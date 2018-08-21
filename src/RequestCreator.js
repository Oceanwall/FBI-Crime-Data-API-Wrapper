const fetch = require('node-fetch');

const ErrorChecker = require("./ErrorChecker");
const check = new ErrorChecker();

const BASE_URL = "https://api.usa.gov/crime/fbi/sapi/api/";


class RequestCreator {

  constructor(userAPIkey) {
    check.exists(userAPIkey, "API Key");
    this.userAPIkey = `api_key=${userAPIkey}`;
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

  getPoliceEmployment(scope = "national", relevantInfo = "") {
    return RequestCreator.GETrequest(`${BASE_URL}police-employment/${scope}/${relevantInfo}?${this.userAPIkey}`);
  }

  getCrimeSummary(ori, offense) {
    return RequestCreator.GETrequest(`${BASE_URL}summarized/agencies/${ori}/${offense}?${this.userAPIkey}`);
  }

  getVictims(scope, offense, classification, relevantInfo) {
    if (scope == "national") {
      return RequestCreator.GETrequest(`${BASE_URL}nibrs/${offense}/victim/${scope}/${classification}?${this.userAPIkey}`);
    }
    else return RequestCreator.GETrequest(`${BASE_URL}nibrs/${offense}/victim/${scope}/${relevantInfo}/${classification}?${this.userAPIkey}`);
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
