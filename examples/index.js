require('dotenv').config();
const FBI_Wrapper = require("../src/FBI_Wrapper");

let wrapper = new FBI_Wrapper(process.env.API_KEY);

// Getting information about agencies

// wrapper.getAgencies().then((results) => {
//   console.log(results);
// });
//
// wrapper.getAgencyByORI("MN0480400").then((results) => {
//   console.log(results);
// });
//
// wrapper.getAgenciesByState("DC").then((results) => {
//   console.log(results);
// });
//NOTE: Maybe rely on longitude / latitude to determine nearby-ness
//NOTE: USES ORI9 ids

//Gettng information about states

// wrapper.getStates(1).then((results) => {
//   console.log(results);
// });
//
// wrapper.getStateByAbbreviation("WA").then((results) => {
//   console.log(results);
// });

//Getting information about police employment statistics

// wrapper.getPoliceByORI("MN0480400").then((results) => {
//   console.log(results);
// });
// wrapper.getPoliceByNation().then((results) => {
//   console.log(results);
// });
// wrapper.getPoliceByRegion(1).then((results) => {
//   console.log(results);
// });
// wrapper.getPoliceByRegion("Midwest").then((results) => {
//   console.log(results);
// });
// wrapper.getPoliceByState("TX").then((results) => {
//   console.log(results);
// });

//Getting information about offenses via ORI
//Types of offenses:  "violent_crime" ,
    // "homicide"
    // "rape-legacy"
    // "rape-revised"
    // "robbery"
    // "aggravated-assault"
    // "property-crime"
    // "burglary"
    // "larceny"
    // "motor-vehicle-theft"
    // "arson"
// wrapper.getCrimesByORI("MN0480400").then((results) => {
//   console.log(results);
// });
// wrapper.getCrimesByORI("MN0480400", "burglary").then((results) => {
//   console.log(results);
// });


//Victim demographic data
//Same type of offenses as previous, but also allows for variables: (age, count, ethnicity, race, sex, relationship)
//Note: Data is not guranteed for every ORI; possible for an empty data array
// wrapper.getVictimsByORI("MI2802800", "burglary", "age").then((results) => {
//   console.log(results);
// });
// wrapper.getVictimsByNation("burglary", "age").then((results) => {
//   console.log(results);
// });
// wrapper.getVictimsByRegion("West", "burglary", "age").then((results) => {
//   console.log(results);
// });
// wrapper.getVictimsByState("TX", "burglary", "age").then((results) => {
//   console.log(results);
// });

//Offender demographic data
// wrapper.getOffendersByORI("MI2802800", "arson", "race").then((results) => {
//   console.log(results);
// });
// wrapper.getOffendersByNation("arson", "race").then((results) => {
//   console.log(results);
// });
// wrapper.getOffendersByRegion("West", "arson", "race").then((results) => {
//   console.log(results);
// });
// wrapper.getOffendersByState("TX", "arson", "race").then((results) => {
//   console.log(results);
// });

//UCR counts of crimes
// wrapper.getCrimeCountByNation("aggravated-assault").then((results) => {
//   console.log(results);
// });
// wrapper.getCrimeCountByRegion("West", "aggravated-assault").then((results) => {
//   console.log(results);
// });
// wrapper.getCrimeCountByState("TX", "aggravated-assault").then((results) => {
//   console.log(results);
// });
// wrapper.getCrimeCountByORI("MI2802800", "aggravated-assault").then((results) => {
//   console.log(results);
// });

//Detailed arson stats
// wrapper.getDetailedArsonStatsByNation().then((results) => {
//   console.log(results);
// });
//Separates details into states
// wrapper.getDetailedArsonStatsByRegion("West").then((results) => {
//   console.log(results);
// });
// wrapper.getDetailedArsonStatsByState("TX").then((results) => {
//   console.log(results);
// });

//TODO: Participation, Estimates
