// Demonstrates how to use this package and its methods.

require('dotenv').config({path: '../.env'});
const FBI_Wrapper = require("../src/FBI_Wrapper");

// Creating the FBI_Wrapper object
let wrapper = new FBI_Wrapper(process.env.API_KEY);

// Getting information about agencies

wrapper.getAgencies().then((results) => {
  console.log(results);
});

wrapper.getAgenciesByState("DC").then((results) => {
  console.log(results);
});

wrapper.getAgencyByORI("MN0480400").then((results) => {
  console.log(results);
});

//Gettng information about states

wrapper.getStates(1).then((results) => {
  console.log(results);
});

wrapper.getStateByAbbreviation("WA").then((results) => {
  console.log(results);
});

// Getting information about regions

wrapper.getRegions().then((results) => {
  console.log(results);
});
wrapper.getRegionsByName("West").then((results) => {
  console.log(results);
});

// Getting information about police employment statistics

wrapper.getPoliceByNation().then((results) => {
  console.log(results);
});
wrapper.getPoliceByRegion(1).then((results) => {
  console.log(results);
});
wrapper.getPoliceByRegion("Midwest").then((results) => {
  console.log(results);
});
wrapper.getPoliceByState("TX").then((results) => {
  console.log(results);
});
wrapper.getPoliceByORI("MN0480400").then((results) => {
  console.log(results);
});

// Getting information about victim demographic data

wrapper.getVictimsByNation("burglary", "count").then((results) => {
  console.log(results);
});
wrapper.getVictimsByRegion("West", "burglary", "age").then((results) => {
  console.log(results);
});
wrapper.getVictimsByState("TX", "burglary", "age").then((results) => {
  console.log(results);
});
wrapper.getVictimsByORI("MI2802800", "burglary", "age").then((results) => {
  console.log(results);
});

// Getting information about offender demographic data

wrapper.getOffendersByNation("arson", "race").then((results) => {
  console.log(results);
});
wrapper.getOffendersByRegion("West", "arson", "race").then((results) => {
  console.log(results);
});
wrapper.getOffendersByState("TX", "arson", "race").then((results) => {
  console.log(results);
});
wrapper.getOffendersByORI("MI2802800", "arson", "race").then((results) => {
  console.log(results);
});

//Getting information about crime frequency

wrapper.getCrimeCountByNation("aggravated-assault").then((results) => {
  console.log(results);
});
wrapper.getCrimeCountByRegion("West", "aggravated-assault").then((results) => {
  console.log(results);
});
wrapper.getCrimeCountByState("TX", "aggravated-assault").then((results) => {
  console.log(results);
});
wrapper.getCrimeCountByORI("MI2802800", "aggravated-assault").then((results) => {
  console.log(results);
});

// Getting detailed statistics about offenses committed within the jurisdiction of an agency

wrapper.getCrimesByORI("MN0480400").then((results) => {
  console.log(results);
});
wrapper.getCrimesByORI("MN0480400", "burglary").then((results) => {
  console.log(results.results);
});

// Getting information about detailed arson statistics

wrapper.getDetailedArsonStatsByNation().then((results) => {
  console.log(results);
});
wrapper.getDetailedArsonStatsByRegion("West").then((results) => {
  console.log(results);
});
wrapper.getDetailedArsonStatsByState("TX").then((results) => {
  console.log(results);
});

// Getting information about UCR participation statistics

wrapper.getParticipationByNation().then((results) => {
  console.log(results);
});
wrapper.getParticipationByRegion("West").then((results) => {
  console.log(results);
});
wrapper.getParticipationByState("TX").then((results) => {
  console.log(results);
});
wrapper.getParticipationByORI("MN0480400").then((results) => {
  console.log(results);
});

// Getting information about UCR crime estimates

wrapper.getCrimeEstimatesByNation().then((results) => {
  console.log(results);
});
wrapper.getCrimeEstimatesByRegion("West").then((results) => {
  console.log(results);
});
wrapper.getCrimeEstimatesByState("TX").then((results) => {
  console.log(results);
});
