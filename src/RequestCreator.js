const fetch = require('node-fetch');

const BASE_URL = "https://api.usa.gov/crime/fbi/sapi/api/";


class RequestCreator {

  constructor(userAPIkey, strictErrorChecking) {
    if (typeof userAPIkey == "undefined" || typeof userAPIkey == "null") {
      throw new Error(`${userAPIkey} does not exist.`);
    }

    if (!strictErrorChecking)
      console.warn("Disabling strict error checking is now deprecated.");

    this.userAPIkey = `api_key=${userAPIkey}`;
  }

  // Functions for checking and standardizing region identifiers.
  checkValidRegion(regionName) {
    if (typeof regionName == "number") {
      regionName = this.convertRegionNumberToRegionName(regionName);
      return regionName;
    }
    else if (typeof regionName == "string") {
      regionName = this.standardizeRegionName(regionName);
      return regionName;
    }
    else
      throw new Error("Expected regionName parameter to be number or string, received: " + typeof regionName);
  }

  convertRegionNumberToRegionName(regionNumber) {
    switch(regionNumber) {
      case(0):
        return "U.S. Territories";
      case(1):
        return "Northeast";
      case(2):
        return "Midwest";
      case(3):
        return "South";
      case(4):
        return "West";
      case(99):
        return "Other";
      default:
        throw new Error("Provided region number is invalid. Expected 0-4 or 99, received: " + regionNumber);
    }
  }

  convertRegionNameToRegionNumber(regionName) {
    switch(regionName) {
      case("U.S. Territories"):
        return 0;
      case("Northeast"):
        return 1;
      case("Midwest"):
        return 2;
      case("South"):
        return 3;
      case("West"):
        return 4;
      case("Other"):
        return 99;
      default:
        throw new Error("Provided region number is invalid. Expected 0-4 or 99, received: " + regionNumber);
    }
  }

  standardizeRegionName(regionName) {
    switch(regionName.toLowerCase()) {
      case("u.s. territories"):
        return "U.S. Territories";
      case("northwest"):
        return "Northeast";
      case("midwest"):
        return "Midwest";
      case("south"):
        return "South";
      case("west"):
        return "West";
      case("other"):
        return "Other";
      default:
        throw new Error("Provided region name is invalid. Received: " + regionName);
    }
  }

  // Haversine Distance formula, used for calculating great-circle distance (km)
  // between two points on a sphere given their latitudes and longitudes.
  haversineDistance(latitude1, longitude1, latitude2, longitude2) {
    // Radius of Earth (in km)
    let earthRadius = 6371;
    let latitudeDifference = this.degreesToRadians(latitude2 - latitude1);
    let longitudeDifference = this.degreesToRadians(longitude2 - longitude1);

    let havTheta = Math.pow(Math.sin(latitudeDifference / 2), 2) +
                   Math.cos(this.degreesToRadians(latitude1)) * Math.cos(this.degreesToRadians(latitude2)) *
                   Math.pow(Math.sin(longitudeDifference / 2), 2);

    let distance = 2 * earthRadius * Math.asin(Math.sqrt(havTheta));

    // Distance in km
    return distance;
  }

  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  checkValidRange(range) {
    if (typeof range != "number")
      throw new Error("Expected range to be number, received: " + typeof range);
    if (range < 0)
      throw new Error("Range cannot be negative");
  }

  checkValidCoordinates(latitude, longitude) {
    if (typeof latitude != "number")
      throw new Error("Expected latitude to be number, received: " + typeof latitude);
    if (typeof longitude != "number")
      throw new Error("Expected longitude to be number, received: " + typeof longitude);
    if (Math.abs(latitude) > 85.05115)
      throw new Error("Latitude beyond valid range");
    if (Math.abs(longitude) > 180)
      throw new Error("Longitude beyond valid range");
  }

  checkNumParameters(numPassedArguments, targetMethod) {
    let numRequiredArguments = targetMethod.length;
    let methodName = targetMethod.name;

    if (numPassedArguments < numRequiredArguments) {
      throw new Error(`Insufficent arguments were passed to method ${methodName}. ${numRequiredArguments} were expected, but only ${numPassedArguments} were passed.`);
    }
    else if (numPassedArguments > numRequiredArguments) {
      throw new Error(`Too many arguments were passed to method ${methodName}. ${numRequiredArguments} were expected, but ${numPassedArguments} were passed.`);
    }
  }

  checkTypeParameter(parameter, desiredType, name) {
    // Special check for arrays (which are typeof object).
    if (desiredType == "array" && Array.isArray(parameter))
      return;
    if (typeof parameter != desiredType)
      throw new Error(`Failed expectation: Argument '${name}' must be a '${desiredType}'.`);
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
