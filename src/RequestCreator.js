const fetch = require('node-fetch');

const ErrorChecker = require("./ErrorChecker");
const check = new ErrorChecker();

const BASE_URL = "https://api.usa.gov/crime/fbi/sapi/api/";


class RequestCreator {

  constructor(userAPIkey) {
    check.exists(userAPIkey, "API Key");
    this.userAPIkey = `api_key=${userAPIkey}`;
  }

  getAgencies(type = "default", relevantInfo = "") {
    check.exists(type, "Agencies GET request criteria");

    switch(type) {
      case "default":
      case "ORI":
        return RequestCreator.GETrequest(`${BASE_URL}agencies/${relevantInfo}?${this.userAPIkey}`);
        break;
      case "STATE":
        return RequestCreator.GETrequest(`${BASE_URL}agencies/byStateAbbr/${relevantInfo}?${this.userAPIkey}`);
        break;
      default:
        check.invalidParams("getAgencies");
        break;
    }

    //additional error handling in case a getAgencies call somehow gets through?
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
