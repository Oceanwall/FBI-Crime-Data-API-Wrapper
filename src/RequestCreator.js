const fetch = require('node-fetch');

const BASE_URL = "https://api.usa.gov/crime/fbi/sapi/api/";


class RequestCreator {

  constructor(userAPIkey, strictErrorChecking) {
    if (strictErrorChecking) {
      if (typeof userAPIkey == "undefined" || typeof userAPIkey == "null") {
        throw new Error(`${userAPIkey} does not exist.`);
      }
    }

    this.userAPIkey = `api_key=${userAPIkey}`;
    this.checkErrors = strictErrorChecking;
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

  checkParameters(numPassedArguments, targetMethod) {
    if (this.checkErrors) {
      let numRequiredArguments = targetMethod.length;
      let methodName = targetMethod.name;

      if (numPassedArguments < numRequiredArguments) {
        throw new Error(`Insufficent arguments were passed to method ${methodName}. ${numRequiredArguments} were expected, but only ${numPassedArguments} were passed.`);
      }
      else if (numPassedArguments > numRequiredArguments) {
        throw new Error(`Too many arguments were passed to method ${methodName}. ${numRequiredArguments} were expected, but ${numPassedArguments} were passed.`);
      }
    }
  }

  getAgencies(type = "default", relevantInfo = "", pageNumber = 0) {
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
    }
  }

  getStates(stateAbbreviation = "", pageNumber = 0) {
    return RequestCreator.GETrequest(`${BASE_URL}states/${stateAbbreviation}?${this.userAPIkey}&page=${pageNumber}`);
  }

  getRegions(regionName = "") {
    return new Promise((resolve, reject) => {
      RequestCreator.GETrequest(`${BASE_URL}regions/${regionName}?${this.userAPIkey}`).then((rawResults) => {
        if (regionName == "") {
          resolve(rawResults.results);
        }
        else resolve(rawResults);
      });
    });
  }

  getPoliceEmployment(scope = "national", relevantInfo = "") {
    return new Promise((resolve, reject) => {
      RequestCreator.GETrequest(`${BASE_URL}police-employment/${scope}/${relevantInfo}?${this.userAPIkey}`).then((rawResults) => {
        resolve(rawResults.results);
      });
    });
  }

  getParticipants(type, scope, offense, classification, relevantInfo) {
    if (scope == "national") {
      return RequestCreator.GETrequest(`${BASE_URL}nibrs/${offense}/${type}/${scope}/${classification}?${this.userAPIkey}`);
    }
    else return RequestCreator.GETrequest(`${BASE_URL}nibrs/${offense}/${type}/${scope}/${relevantInfo}/${classification}?${this.userAPIkey}`);
  }

  getCrimeCount(scope, offense, relevantInfo = "") {
    return new Promise((resolve, reject) => {
      this.getParticipants("offense", scope, offense, "count", relevantInfo).then((rawResults) => {
        resolve(rawResults.data);
      });
    });
  }

  getCrimeSummary(ori, offense) {
    return new Promise((resolve, reject) => {
      RequestCreator.GETrequest(`${BASE_URL}summarized/agencies/${ori}/${offense}?${this.userAPIkey}`).then((rawResults) => {
        if (offense == "offenses") {
          resolve(rawResults.results);
        }
        else resolve(rawResults);
      });
    });
  }

  // Detailed stats offered only for arson...
  getArsonStats(scope, relevantInfo = "") {
    return new Promise((resolve, reject) => {
      RequestCreator.GETrequest(`${BASE_URL}arson/${scope}/${relevantInfo}?${this.userAPIkey}`).then((rawResults) => {
        resolve(rawResults.results);
      });
    });
  }

  getAgencyParticipation(scope, relevantInfo = "") {
    return new Promise((resolve, reject) => {
      RequestCreator.GETrequest(`${BASE_URL}participation/${scope}/${relevantInfo}?${this.userAPIkey}`).then((rawResults) => {
        resolve(rawResults.results);
      });
    });
  }

  getEstimates(scope, relevantInfo = "") {
    return new Promise((resolve, reject) => {
      RequestCreator.GETrequest(`${BASE_URL}estimates/${scope}/${relevantInfo}?${this.userAPIkey}`).then((rawResults) => {
        resolve(rawResults.results);
      });
    });
  }

  static GETrequest(targetURL) {
    return new Promise((resolve, reject) => {
      fetch(targetURL)
      .then((result) => {
        return result.json();
      })
      .then((body) => {
        resolve(body);
      })
      .catch((error) => {
        console.error("An error occurred while attempting to make the GET request.");
        throw error;
      })
    });
  }


}

module.exports = RequestCreator;
