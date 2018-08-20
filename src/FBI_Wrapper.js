const RequestCreator = require("./RequestCreator");

class FBI_Wrapper {

  constructor(userAPIkey) {
    this.request = new RequestCreator(userAPIkey);
  }

  //returns object w/ properties states w/ properties ori w/ properties of each agency
  getAgencies() {
    return this.request.getAgencies();
  }

  //Should empty param be allowed? Makes same call as getAgencies then
  getAgencyByORI(ori) {
    return this.request.getAgencies("ORI", ori);
  }

  getAgenciesByState(stateAbbreviation) {
    return this.request.getAgencies("STATE", stateAbbreviation);
  }

}

module.exports = FBI_Wrapper;
