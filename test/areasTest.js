require('dotenv').config();

const expect = require('chai').expect;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Area Information Calls", function() {

  it("should get information about (all) states", async function() {
    var information = await wrapper.getStates(2);
    expect(information).to.be.an('object');
  });

  it("should get information about a specific state", async function() {
    var information = await wrapper.getStateByAbbreviation('MN');
    expect(information).to.be.an('object');
  });

  it("should get information about (all) regions", async function() {
    var information = await wrapper.getRegions();
    expect(information).to.be.an('array');
  });

  it("should get information about a specfic region", async function() {
    var information = await wrapper.getRegionsByName("Midwest");
    expect(information).to.be.an('object');
  });

});
