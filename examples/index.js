// Demonstrates how to use this package and its methods.

require('dotenv').config({path: '../.env'});
const FBI_Wrapper = require("../src/FBI_Wrapper");

// Creating the FBI_Wrapper object
let wrapper = new FBI_Wrapper(process.env.API_KEY);

/* The following functions get all agencies within a 100 km radius of some coordinate
 * address, determine which agencies participate in NIBRS, and (log) an array of
 * objects containing {agency name, population covered in 2016, and total police
 * employment by that agency in 2016}.
 */

// Using promises.
wrapper.getAgenciesByCoordinates(42.12075, -85.53094, 100).then((agencies) => {

  let participatingAgencies = [];
  let policeInfoPromises = [];
  let agencyPoliceInfo = [];

  // Get agencies that participate in NIBRS
  for (let agency of agencies) {
    if (agency.nibrs)
      participatingAgencies.push(agency.ori);
  }

  // Make requests to get police information of those agencies.
  for (let ori of participatingAgencies)
    policeInfoPromises.push(wrapper.getPoliceByORI(ori));

  // Once all of the request-promises have resolved:
  Promise.all(policeInfoPromises).then((policeInfo) => {
    for (let info of policeInfo) {
      // Basic undefined check to avoid "un-iterable" error.
      if (typeof info == "undefined")
        continue;

      // Find the agency's 2016 info, and create a data object.
      for (let yearInfo of info) {
        if (yearInfo.data_year == 2016) {
          let temp = {name: yearInfo.ncic_agency_name,
                      population: yearInfo.population,
                      employment: yearInfo.total_pe_ct};
          agencyPoliceInfo.push(temp);
        }
      }
    }

    console.log(agencyPoliceInfo);
  });

});

// Using async functions
getPoliceData();

async function getPoliceData() {
  let agencies = await wrapper.getAgenciesByCoordinates(42.12075, -85.53094, 100);
  let participatingAgencies = [];
  let policeInfoPromises = [];
  let agencyPoliceInfo = [];

  // Get agencies that participate in NIBRS
  for (let agency of agencies) {
    if (agency.nibrs)
      participatingAgencies.push(agency.ori);
  }

  // Make requests to get police information of those agencies.
  for (let ori of participatingAgencies)
    policeInfoPromises.push(wrapper.getPoliceByORI(ori));

  // Once all of the request-promises have resolved:
  let policeInfo = await Promise.all(policeInfoPromises);

  for (let info of policeInfo) {
    // Basic undefined check to avoid "un-iterable" error.
    if (typeof info == "undefined")
      continue;

    // Find the agency's 2016 info, and create a data object.
    for (let yearInfo of info) {
      if (yearInfo.data_year == 2016) {
        let temp = {name: yearInfo.ncic_agency_name,
                    population: yearInfo.population,
                    employment: yearInfo.total_pe_ct};
        agencyPoliceInfo.push(temp);
      }
    }
  }

  console.log(agencyPoliceInfo);
}
