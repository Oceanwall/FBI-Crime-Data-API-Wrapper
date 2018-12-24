const RequestCreator = require("./RequestCreator");

// NOTE: General parameter layouts: relevantInformation, offenseInformation, classificationInformation, pageNumber
// NOTE: Page Number is an optional parameter
// NOTE: Method layout is as follows (Larger Scope -> Smaller Scope)

/* ALL METHODS RETURN PROMISES, THE RETURN TYPES ARE AFTER THE PROMISES HAVE BEEN RESOLVED */

const NATIONAL_SCOPE = "national";
const REGIONAL_SCOPE = "regions";
const STATE_SCOPE = "states";
const ORI_SCOPE = "agencies";

class FBI_Wrapper {

  /**
   * Creates a new FBI_Wrapper object, which is used to more easily access the FBI UCR API.<br>
   * @param {String} userAPIkey The api.data.gov API key, which is required to access the FBI UCR API. API Keys can be generated here: https://api.data.gov/signup/
   * @param {Boolean} [strictErrorChecking=true] NOW DEPRECATED, DO NOT USE. Disabled error checking by the wrapper.
   */
  constructor(userAPIkey, strictErrorChecking = true) {
    this.request = new RequestCreator(userAPIkey, strictErrorChecking);
  }

  //Get agencies

  /**
   * Gets information about all agencies in the United States.<br>
   * If desiring to get information about all agencies in the U.S in an array form, consider using getAgenciesByRegion and passing in the "U.S" territories parameter.<br>
   * @return {Object} Information about each agency in the U.S, subdivided into states that are further subdivided into agency objects (identified by their ORI-9 (Department Originating Agency Identifier Number, character length 9)).
   */
  getAgencies() {
    this.request.checkNumParameters(arguments.length, this.getAgencies);
    return this.request.getAgencies();
  }

  /**
   * Gets information about all the agencies within *range* kilometers of the provided coordinates.
   * @param {Number} latitude   Desired latitude to center agency search around.
   * @param {Number} longitude  Desired longitude to center agency search around.
   * @param {Number} [range=50] Length (km) of circular radius in which to find agencies.
   * @return {Array}            Information about all the agencies within *range* kilometers of the provided coordinates
   */
  getAgenciesByCoordinates(latitude, longitude, range = 50) {
    this.request.checkValidRange(range);
    this.request.checkValidCoordinates(latitude, longitude);

    return new Promise((resolve, reject) => {
      this.request.getAgencies().then((result) => {
        if (typeof result == "undefined")
          return resolve(undefined);

        let agencies = [];
        for (let stateName of Object.getOwnPropertyNames(result)) {
          let state = result[stateName];
          for (let agency of Object.getOwnPropertyNames(state)) {
            if (this.request.haversineDistance(latitude, longitude, state[agency].latitude, state[agency].longitude) <= range)
              agencies.push(state[agency]);
          }
        }

        resolve(agencies);
      });
    });
  }

  /**
   * Gets information about all agencies in a specific region.<br>
   * Permitted region numerical codes are 0, 1, 2, 3, 4, 99<br>
   * Permitted region string names are "U.S. Territories", "Northeast", "Midwest", "South", "West", "Other".<br>
   * @param  {Number|String} regionName This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @return {Array}                    Information about all the agencies in that specific region. Undefined if a bad region name is provided.
   */
  getAgenciesByRegion(regionName) {
    this.request.checkNumParameters(arguments.length, this.getAgenciesByRegion);
    regionName = this.request.checkValidRegion(regionName);

    let allRegions = regionName == "U.S. Territories";

    return new Promise((resolve, reject) => {
      this.request.getAgencies().then((result) => {
        if (typeof result == "undefined")
          return resolve(undefined);

        let agencies = [];
        for (let stateName of Object.getOwnPropertyNames(result)) {
          let state = result[stateName];
          for (let agency of Object.getOwnPropertyNames(state)) {
            if (allRegions || state[agency].region_name == regionName)
              agencies.push(state[agency]);
          }
        }

        resolve(agencies);
      });
    });
  }

  /**
   * Gets information about all agencies in a given state<br>
   * @param  {String} stateAbbreviation State abbreviation
   * @param  {Number} [pageNumber=0]    For states with many agencies, data is delivered in multiple "pages", as indicated by the pagination property/object in the returned object. This property allows you to select which page of results you want (Pages are 0-indexed).
   * @return {Object}                   Information about each agency in a given state.
   */
  getAgenciesByState(stateAbbreviation, pageNumber = 0) {
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");
    this.request.checkTypeParameter(pageNumber, "number", "pageNumber");

    return this.request.getAgencies("state", stateAbbreviation, pageNumber);
  }

  /**
   * Gets information about a specific agency, as identified by the provided ORI-9.<br>
   * If no ORI is provided, then gets information about all agencies in the United States.<br>
   * @param  {String} [ori=""] The ORI of the desired agency.
   * @return {Object}          Information about the desired agency, or if no ORI is provided, information about each agency in the U.S.
   */
  getAgencyByORI(ori = "") {
    this.request.checkTypeParameter(ori, "string", "ori");

    return this.request.getAgencies("ori", ori);
  }

  //Get states

  /**
   * Gets identifying information about all the states in the U.S, such as their ID, abbreviation, and region.<br>
   * Expressed in separate pages (20 results per page). If desiring all states at once, use getAllStates()<br>
   * @param  {Number} [pageNumber=0] Denotes a specific page of results to view, as indicated by the pagination property/object. Each call only returns 20 states at a time.
   * @return {Object}                Information about (20) states.
   */
  getStates(pageNumber = 0) {
    this.request.checkTypeParameter(pageNumber, "number", "pageNumber");

    return this.request.getStates("", pageNumber);
  }

  /**
   * Gets identifying information about all the states in the U.S, such as their ID, abbreviation, and region<br>
   * @return {Array} Information about all US states.
   */
  getAllStates() {
    this.request.checkNumParameters(arguments.length, this.getAllStates);

    return new Promise((resolve, reject) => {
      // Makes the first request, and then uses the pagination property to make remaining requests.
      // Editable (hardcode X # of requests, or simply store all state objects) for efficiency, but less extendability.
      this.getStates().then((states0) => {
        let states = [];
        let remainingRequests = [];
        for (let i = 1; i < states0.pagination.pages; i++) {
          remainingRequests.push(this.getStates(i));
        }

        Promise.all(remainingRequests).then((remainingStates) => {
          // Add all states from first page.
          for (let state of states0.results)
            states.push(state);

          for (let page of remainingStates) {
            for (let state of page.results) {
              states.push(state);
            }
          }

          resolve(states);
        });
      });
    });
  }

  /**
   * Gets identifying information about all states in a specified region<br>
   * @param  {Number|String} regionName This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @return {Array}                    Information about all states in that region.
   */
  getStatesByRegion(regionName) {
    this.request.checkNumParameters(arguments.length, this.getStatesByRegion);
    regionName = this.request.convertRegionNameToRegionNumber(this.request.checkValidRegion(regionName));

    return new Promise((resolve, reject) => {
      this.getAllStates().then((result) => {
        if (typeof result == "undefined")
          return resolve(undefined);

        let regionStates = [];
        for (let state of result) {
          if (state.region_code == regionName)
            regionStates.push(state);
        }

        resolve(regionStates);
      });
    });
  }

  /**
   * Gets identifying information about a specific state based on its abbreviation.<br>
   * @param  {String} stateAbbreviation State abbreviation (two characters long, like TX).
   * @return {Object}                   Identifying information about that state.
   */
  getStateByAbbreviation(stateAbbreviation) {
    this.request.checkNumParameters(arguments.length, this.getStateByAbbreviation);
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");

    return this.request.getStates(stateAbbreviation);
  }

  //Get regions

  /**
   * Gets identifying information about all the regions in the U.S<br>
   * @return {Array} Information about all regions in the U.S
   */
  getRegions() {
    this.request.checkNumParameters(arguments.length, this.getRegions);

    return this.request.getRegions();
  }

  /**
   * Gets identifying information about a specific region based on its name or numerical code.<br>
   * @param  {Number|String} regionName This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @return {Object}                   Information about that specific region.
   */
  getRegionsByName(regionName) {
    this.request.checkNumParameters(arguments.length, this.getRegionsByName);
    regionName = this.request.checkValidRegion(regionName);

    return this.request.getRegions(regionName);
  }

  //Get police employment statistics

  /**
   * Gets nationwide police employment statistics for each year (up to 1960).<br>
   * @return {Array} Nationwide police employment statistics for each year
   */
  getPoliceByNation() {
    this.request.checkNumParameters(arguments.length, this.getPoliceByNation);

    return this.request.getPoliceEmployment();
  }

  /**
   * Gets regionwide police employment statistics for each year (up to 1960).<br>
   * @param  {Number|String} regionName This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @return {Array}                    Regionwide police employment statistics for each year
   */
  getPoliceByRegion(regionName) {
    this.request.checkNumParameters(arguments.length, this.getPoliceByRegion);
    regionName = this.request.checkValidRegion(regionName);

    return this.request.getPoliceEmployment(REGIONAL_SCOPE, regionName);
  }

  /**
   * Gets statewide police employment statistics for each year (up to 1960).<br>
   * @param  {String} stateAbbreviation State Abbreviation, two characters long
   * @return {Array}                    Statewide police employment statistics for each year
   */
  getPoliceByState(stateAbbreviation) {
    this.request.checkNumParameters(arguments.length, this.getPoliceByState);
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");

    return this.request.getPoliceEmployment(STATE_SCOPE, stateAbbreviation);
  }

  /**
   * Get police employment statistics for a certain agency (hypothetically up the 1960, but many agencies didn't start recording information until later).<br>
   * @param  {String} ori The ORI of the desired agency.
   * @return {Array}      Agency police employment statistics for each year, in addition to other details about the agency (such as the population that year of the served area).
   */
  getPoliceByORI(ori) {
    this.request.checkNumParameters(arguments.length, this.getPoliceByORI);
    this.request.checkTypeParameter(ori, "string", "ori");

    return this.request.getPoliceEmployment(ORI_SCOPE, ori);
  }

  //Get victim demographic statistics

  /**
   * Given a specific offense and a classification criteria for the victims, returns for each year the number of victims (of said offense) that fall into each category of the classification criteria.<br>
   * This method encompasses nation-wide data.<br>
   * Possible offenses are: "violent_crime", "homicide", "rape-legacy", "rape-revised", "robbery", "aggravated-assault", "property-crime", "burglary", "larceny", "motor-vehicle-theft", and "arson".<br>
   * Possible classifications are: "age", "count", "ethnicity", "race", and "sex".<br>
   * Note that entries are not guaranteed to be in any order, and also be aware that for some years, not all agencies reported data, so data might be skewed from before 2005.<br>
   * @param  {String} offense        The offense to find victims of.
   * @param  {String} classification The classification criteria by which the victims will be categorized.
   * @return {Object}                Entries for each year containing the # of (nation-wide victims of the given offense) in each category type.
   */
  getVictimsByNation(offense, classification) {
    this.request.checkNumParameters(arguments.length, this.getVictimsByNation);
    this.request.checkTypeParameter(offense, "string", "offense");
    this.request.checkTypeParameter(classification, "string", "classification");

    return this.request.getParticipants("victim", NATIONAL_SCOPE, offense, classification);
  }

  /**
   * Given a specific offense and a classification criteria for the victims, returns for each year the number of victims (of said offense) that fall into each category of the classification criteria.<br>
   * This method encompasses region-wide data.<br>
   * Additional information can be found under method getVictimsByNation<br>
   * @param  {Number|String} regionName     This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @param  {String} offense               The offense to find victims of.
   * @param  {String} classification        The classification criteria by which the victims will be categorized.
   * @return {Object}                       Entries for each year containing the # of (region-wide victims of the given offense) in each category type.
   */
  getVictimsByRegion(regionName, offense, classification) {
    this.request.checkNumParameters(arguments.length, this.getVictimsByRegion);
    regionName = this.request.checkValidRegion(regionName);
    this.request.checkTypeParameter(offense, "string", "offense");
    this.request.checkTypeParameter(classification, "string", "classification");

    return this.request.getParticipants("victim", REGIONAL_SCOPE, offense, classification, regionName);
  }

  /**
   * Given a specific offense and a classification criteria for the victims, returns for each year the number of victims (of said offense) that fall into each category of the classification criteria.<br>
   * This method encompasses state-wide data.<br>
   * Additional information can be found under method getVictimsByNation<br>
   * @param  {String} stateAbbreviation State Abbreviation, two characters long
   * @param  {String} offense           The offense to find victims of.
   * @param  {String} classification    The classification criteria by which the victims will be categorized.
   * @return {Object}                   Entries for each year containing the # of (state-wide victims of the given offense) in each category type.
   */
  getVictimsByState(stateAbbreviation, offense, classification) {
    this.request.checkNumParameters(arguments.length, this.getVictimsByState);
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");
    this.request.checkTypeParameter(offense, "string", "offense");
    this.request.checkTypeParameter(classification, "string", "classification")
    ;
    return this.request.getParticipants("victim", STATE_SCOPE, offense, classification, stateAbbreviation)
  }

  /**
   * Given a specific offense and a classification criteria for the victims, returns for each year the number of victims (of said offense) that fall into each category of the classification criteria.<br>
   * This method encompasses agency-wide data.<br>
   * Additional information can be found under method getVictimsByNation<br>
   * @param  {String} ori            The ORI of the agency in question
   * @param  {String} offense        The offense to find victims of.
   * @param  {String} classification The classification criteria by which the victims will be categorized.
   * @return {Object}                Entries for each year containing the # of (agency-wide victims of the given offense) in each category type.
   */
  getVictimsByORI(ori, offense, classification) {
    this.request.checkNumParameters(arguments.length, this.getVictimsByORI);
    this.request.checkTypeParameter(ori, "string", "ori");
    this.request.checkTypeParameter(offense, "string", "offense");
    this.request.checkTypeParameter(classification, "string", "classification");

    return this.request.getParticipants("victim", ORI_SCOPE, offense, classification, ori);
  }

  //Get offender demographic statistics

  /**
   * Given a specific offense and a classification criteria for the offenders, returns for each year the number of offenders (who committed said offense) that fall into each category of the classification criteria.<br>
   * This method encompasses nation-wide data.<br>
   * Additional information can be found under method getVictimsByNation<br>
   * @param  {String} offense        The offense for which to find offenders.
   * @param  {String} classification The classification criteria by which the offenders will be categorized.
   * @return {Object}                Entries for each year containing the # of (nation-wide offenders who committed the given offense) in each category type.
   */
  getOffendersByNation(offense, classification) {
    this.request.checkNumParameters(arguments.length, this.getOffendersByNation);
    this.request.checkTypeParameter(offense, "string", "offense");
    this.request.checkTypeParameter(classification, "string", "classification");

    return this.request.getParticipants("offender", NATIONAL_SCOPE, offense, classification);
  }

  /**
   * Given a specific offense and a classification criteria for the offenders, returns for each year the number of offenders (who committed said offense) that fall into each category of the classification criteria.<br>
   * This method encompasses region-wide data.<br>
   * Additional information can be found under method getVictimsByNation<br>
   * @param  {Number|String} regionName     This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @param  {String} offense               The offense for which to find offenders.
   * @param  {String} classification        The classification criteria by which the offenders will be categorized.
   * @return {Object}                       Entries for each year containing the # of (region-wide offenders who committed the given offense) in each category type.
   */
  getOffendersByRegion(regionName, offense, classification) {
    this.request.checkNumParameters(arguments.length, this.getOffendersByRegion);
    regionName = this.request.checkValidRegion(regionName);
    this.request.checkTypeParameter(offense, "string", "offense");
    this.request.checkTypeParameter(classification, "string", "classification");

    return this.request.getParticipants("offender", REGIONAL_SCOPE, offense, classification, regionName);
  }

  /**
   * Given a specific offense and a classification criteria for the offenders, returns for each year the number of offenders (who committed said offense) that fall into each category of the classification criteria.<br>
   * This method encompasses state-wide data.<br>
   * Additional information can be found under method getVictimsByNation<br>
   * @param  {String} stateAbbreviation State Abbreviation, two characters long
   * @param  {String} offense           The offense for which to find offenders.
   * @param  {String} classification    The classification criteria by which the offenders will be categorized.
   * @return {Object}                   Entries for each year containing the # of (state-wide offenders who committed the given offense) in each category type.
   */
  getOffendersByState(stateAbbreviation, offense, classification) {
    this.request.checkNumParameters(arguments.length, this.getOffendersByState);
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");
    this.request.checkTypeParameter(offense, "string", "offense");
    this.request.checkTypeParameter(classification, "string", "classification");

    return this.request.getParticipants("offender", STATE_SCOPE, offense, classification, stateAbbreviation)
  }

  /**
   * Given a specific offense and a classification criteria for the offenders, returns for each year the number of offenders (who committed said offense) that fall into each category of the classification criteria.<br>
   * This method encompasses agency-wide data.<br>
   * Additional information can be found under method getVictimsByNation<br>
   * @param  {String} ori            The ORI of the agency in question
   * @param  {String} offense        The offense for which to find offenders.
   * @param  {String} classification The classification criteria by which the offenders will be categorized.
   * @return {Object}                Entries for each year containing the # of (agency-wide offenders who committed the given offense) in each category type.
   */
  getOffendersByORI(ori, offense, classification) {
    this.request.checkNumParameters(arguments.length, this.getOffendersByORI);
    this.request.checkTypeParameter(ori, "string", "ori");
    this.request.checkTypeParameter(offense, "string", "offense");
    this.request.checkTypeParameter(classification, "string", "classification");

    return this.request.getParticipants("offender", ORI_SCOPE, offense, classification, ori);
  }

  //Get crime frequency statistics

  /**
   * Given a specific offense, returns for each year the number of incidents and (offense occurrences) that occurred involving that offense.<br>
   * Note that the difference between an incident and an offense is that within an incident, a person could have committed multiple offenses.<br>
   * This method encompasses nation-wide data.<br>
   * Additional information can be found under method getVictimsByNation<br>
   * @param  {String} offense The offense for which to find the # of incidents and occurrences.
   * @return {Array}          Entries for each year containing the # of incidents and (offense occurrences) involving the given offense
   */
  getCrimeCountByNation(offense) {
    this.request.checkNumParameters(arguments.length, this.getCrimeCountByNation);
    this.request.checkTypeParameter(offense, "string", "offense");

    return this.request.getCrimeCount(NATIONAL_SCOPE, offense);
  }

  /**
   * Given a specific offense, returns for each year the number of incidents and (offense occurrences) that occurred involving that offense.<br>
   * This method encompasses region-wide data.<br>
   * Additional information can be found under method getCrimeCountByNation<br>
   * @param  {Number|String} regionName This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @param  {String}        offense    The offense for which to find the # of incidents and occurrences.
   * @return {Array}                    Entries for each year containing the # of incidents and (offense occurrences) involving the given offense
   */
  getCrimeCountByRegion(regionName, offense) {
    this.request.checkNumParameters(arguments.length, this.getCrimeCountByRegion);
    regionName = this.request.checkValidRegion(regionName);
    this.request.checkTypeParameter(offense, "string", "offense");

    return this.request.getCrimeCount(REGIONAL_SCOPE, offense, regionName);
  }

  /**
   * Given a specific offense, returns for each year the number of incidents and (offense occurrences) that occurred involving that offense.<br>
   * This method encompasses state-wide data.<br>
   * Additional information can be found under method getCrimeCountByNation<br>
   * @param  {String} stateAbbreviation State Abbreviation, two characters long
   * @param  {String} offense           The offense for which to find the # of incidents and occurrences.
   * @return {Array}                    Entries for each year containing the # of incidents and (offense occurrences) involving the given offense
   */
  getCrimeCountByState(stateAbbreviation, offense) {
    this.request.checkNumParameters(arguments.length, this.getCrimeCountByState);
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");
    this.request.checkTypeParameter(offense, "string", "offense");

    return this.request.getCrimeCount(STATE_SCOPE, offense, stateAbbreviation);
  }

  /**
   * Given a specific offense, returns for each year the number of incidents and (offense occurrences) that occurred involving that offense.<br>
   * This method encompasses agency-wide data.<br>
   * Additional information can be found under method getCrimeCountByNation<br>
   * @param  {String} ori     The ORI of the agency in question
   * @param  {String} offense The offense for which to find offenders.
   * @return {Array}          Entries for each year containing the # of incidents and (offense occurrences) involving the given offense
   */
  getCrimeCountByORI(ori, offense) {
    this.request.checkNumParameters(arguments.length, this.getCrimeCountByORI);
    this.request.checkTypeParameter(ori, "string", "ori");
    this.request.checkTypeParameter(offense, "string", "offense");

    return this.request.getCrimeCount(ORI_SCOPE, offense, ori);
  }

  /**
   * Get detailed statistics about the offenses committed within the jurisdiction of a particular agency.<br>
   * If no one type of offense is specified, then this method returns statistics about all types of offenses.<br>
   * If looking for (a) specific offense(s), note that it is much faster to use getCrimeByOri or getMultipleCrimesByOri.<br>
   * @param  {String} ori                  The ORI of the agency in question
   * @param  {String} [offense="offenses"] The offense for which to find statistics. If no offense is specified, then get statistics about all offenses.
   * @return {(Object|Array)}              Entries for each year containing detailed statistics about (each offense). If looking up a specific offense, returns an object. Otherwise, returns an array.
   */
  getCrimesByORI(ori, offense = "offenses") {
    this.request.checkTypeParameter(ori, "string", "ori");
    this.request.checkTypeParameter(offense, "string", "offense");

    return this.request.getCrimeSummary(ori, offense);
  }

  /**
   * Get detailed statistics about an offense committed within the jurisdiction of a particular agency.<br>
   * Transmits more bandwidth, but is significantly faster (2.5x) than relying on the default API exposed by getCrimesByORI.<br>
   * @param {String} ori     The ORI of the agency in question.
   * @param {String} offense The offense for which to find statistics.
   * @return {Array}         Entries for each year containing detailed statistics about the offense. Returns undefined if the ORI provided is not valid.
   */
  getCrimeByORI(ori, offense) {
    this.request.checkNumParameters(arguments.length, this.getCrimeByORI);
    this.request.checkTypeParameter(ori, "string", "ori");
    this.request.checkTypeParameter(offense, "string", "offense");

    return new Promise((resolve, reject) => {
      this.getCrimesByORI(ori, "offenses").then((result) => {
        if (typeof result == "undefined")
          return resolve(undefined);

        let crimes = [];
        let lowercaseOffense = offense.toLowerCase();

        for (let crime of result) {
          if (crime.offense === lowercaseOffense)
            crimes.push(crime);
        }
        resolve(crimes);
      });
    });
  }

   /**
    * Get detailed statistics about multiple offenses committed within the jurisdiction of a particular agency.<br>
    * Transmits more bandwidth, but is significantly faster (2.5x) than relying on the default API exposed by getCrimesByORI.<br>
    * @param {String} ori     The ORI of the agency in question.
    * @param {Array} offenses The offenses for which to find statistics.
    * @return {Array}         Entries for each year containing detailed statistics about the offenses. Array of arrays, where an index into the returned array matches with that of the offenses array passsed in. Returns undefined if the ORI provided is not valid.
    */
    getMultipleCrimesByOri(ori, offenses) {
      this.request.checkNumParameters(arguments.length, this.getMultipleCrimesByOri);
      this.request.checkTypeParameter(ori, "string", "ori");
      this.request.checkTypeParameter(offenses, "array", "offenses");

      if (offenses.length == 0)
        return [];

      return new Promise((resolve, reject) => {
        this.getCrimesByORI(ori, "offenses").then((result) => {
          if (typeof result == "undefined")
            return resolve(undefined);

          let crimes = [];
          let lowercaseOffenses = [];
          for (let offense of offenses) {
            crimes.push([]);
            lowercaseOffenses.push(offense.toLowerCase());
          }

          for (let crime of result) {
            for (let i = 0; i < lowercaseOffenses.length; i++) {
              if (crime.offense == lowercaseOffenses[i]) {
                crimes[i].push(crime);
                break;
              }
            }
          }

          resolve(crimes);
        });
      });
    }

  //Get detailed arson statistics

  /**
   * For each year, gets detailed statistics about arson, including the # of reports and estimated property damage.<br>
   * This method encompasses nation-wide data.<br>
   * @return {Array} Entries for each year detailing arson statistics
   */
  getDetailedArsonStatsByNation() {
    this.request.checkNumParameters(arguments.length, this.getDetailedArsonStatsByNation);

    return this.request.getArsonStats(NATIONAL_SCOPE);
  }

  /**
   * For each year, gets detailed statistics about arson, including the # of reports and estimated property damage.<br>
   * Note that this method separates its statistics into states, providing individual arson statistics for each state within the region.<br>
   * This method encompasses region-wide data.<br>
   * @param  {Number|String} regionName This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @return {Array}                    Entries for each year detailing arson statistics.
   */
  getDetailedArsonStatsByRegion(regionName) {
    this.request.checkNumParameters(arguments.length, this.getDetailedArsonStatsByRegion);
    regionName = this.request.checkValidRegion(regionName);

    return this.request.getArsonStats(REGIONAL_SCOPE, regionName);
  }

  /**
   * For each year, gets detailed statistics about arson, including the # of reports and estimated property damage.<br>
   * This method encompasses state-wide data.<br>
   * @param  {String} stateAbbreviation State Abbreviation, two characters long
   * @return {Array}                    Entries for each year detailing arson statistics.
   */
  getDetailedArsonStatsByState(stateAbbreviation) {
    this.request.checkNumParameters(arguments.length, this.getDetailedArsonStatsByState);
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");

    return this.request.getArsonStats(STATE_SCOPE, stateAbbreviation);
  }

  //Get participation statistics (with UCR)

  /**
   * For each year, returns the total number of agencies in the U.S in addition to what type of data they submit (SRS, NIBRS).<br>
   * SRS is the old hierarchical crime reporting system (Summary Reporting System) that only collects a limited range of data.<br>
   * NIBRS is the new system (National Incident-Based Reporting System) that allows for more extensive data collection (more crime categories).<br>
   * @return {Array} Entries for each year detailing the number of agencies and how many collect what type of information
   */
  getParticipationByNation() {
    this.request.checkNumParameters(arguments.length, this.getParticipationByNation);

    return this.request.getAgencyParticipation(NATIONAL_SCOPE);
  }

  /**
   * For each year, returns the total number of agencies in the specified region in addition to what type of data they submit (SRS, NIBRS).<br>
   * @param  {Number|String} regionName This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @return {Array}                    Entries for each year detailing the number of agencies and how many collect what type of information
   */
  getParticipationByRegion(regionName) {
    this.request.checkNumParameters(arguments.length, this.getParticipationByRegion);
    regionName = this.request.checkValidRegion(regionName);

    return this.request.getAgencyParticipation(REGIONAL_SCOPE, regionName);
  }

  /**
   * For each year, returns the total number of agencies in the specified state in addition to what type of data they submit (SRS, NIBRS).<br>
   * @param  {String} stateAbbreviation State Abbreviation, two characters long
   * @return {Array}                    Entries for each year detailing the number of agencies and how many collect what type of information
   */
  getParticipationByState(stateAbbreviation) {
    this.request.checkNumParameters(arguments.length, this.getParticipationByState);
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");

    return this.request.getAgencyParticipation(STATE_SCOPE, stateAbbreviation);
  }

  /**
   * For each year, returns the type of data that this specific agency has been reporting, in addition to other relevant data about the agency.<br>
   * @param  {String} ori The ORI of the agency in question
   * @return {Array}      Entries for each year detailing the number of agencies and how many collect what type of information
   */
  getParticipationByORI(ori) {
    this.request.checkNumParameters(arguments.length, this.getParticipationByORI);
    this.request.checkTypeParameter(ori, "string", "ori");

    return this.request.getAgencyParticipation(ORI_SCOPE, ori)
  }

  //Get crime estimates

  /**
   * For each year, returns the estimated number of crimes (in different categories) that occurred.<br>
   * This method encompasses nation-wide data.<br>
   * @return {Array} Entries for each year detailing the estimated number of crimes that occurred.
   */
  getCrimeEstimatesByNation() {
    this.request.checkNumParameters(arguments.length, this.getCrimeEstimatesByNation);

    return this.request.getEstimates(NATIONAL_SCOPE);
  }

  /**
   * For each year, returns the estimated number of crimes (in different categories) that occurred.<br>
   * Note that this method breaks down its statistics into states, providing estimates for each state within the region.<br>
   * This method encompasses region-wide data.<br>
   * @param  {Number|String} regionName This region's numerical code. Note that this parameter can also be a String (the region's name).
   * @return {Array}                    Entries for each year detailing the estimated number of crimes that occurred.
   */
  getCrimeEstimatesByRegion(regionName) {
    this.request.checkNumParameters(arguments.length, this.getCrimeEstimatesByRegion);
    regionName = this.request.checkValidRegion(regionName);

    return this.request.getEstimates(REGIONAL_SCOPE, regionName);
  }

  /**
   * For each year, returns the estimated number of crimes (in different categories) that occurred.<br>
   * This method encompasses state-wide data.<br>
   * @param  {String} stateAbbreviation State Abbreviation, two characters long
   * @return {Array}                    Entries for each year detailing the estimated number of crimes that occurred.
   */
  getCrimeEstimatesByState(stateAbbreviation) {
    this.request.checkNumParameters(arguments.length, this.getCrimeEstimatesByState);
    this.request.checkTypeParameter(stateAbbreviation, "string", "stateAbbreviation");

    return this.request.getEstimates(STATE_SCOPE, stateAbbreviation);
  }

}

module.exports = FBI_Wrapper;
