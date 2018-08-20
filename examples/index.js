require('dotenv').config();
const FBI_Wrapper = require("../src/FBI_Wrapper");

let wrapper = new FBI_Wrapper(process.env.API_KEY);

wrapper.getAgencies().then((results) => {
  console.log(results);
});

wrapper.getAgencyByORI("MN0480400").then((results) => {
  console.log(results);
});

wrapper.getAgenciesByState("DC").then((results) => {
  console.log(results);
});
