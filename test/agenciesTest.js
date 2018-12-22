require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Agency Information Calls", function() {

  it("should get information about (all) agencies", async function() {
    var agencies = await wrapper.getAgencies();
    expect(agencies).to.be.an('object');
  });

  it("should get information about (all) agencies", async function() {
    var agencies = await wrapper.getAgenciesByRegion("u.s. territories");
    expect(agencies).to.be.an('array');
  });

  it("should get information about a region's agencies", async function() {
    var agencies = await wrapper.getAgenciesByRegion(1);
    expect(agencies).to.be.an('array');
  });

  it("should get information about a region's agencies", async function() {
    var agencies = await wrapper.getAgenciesByRegion("south");
    expect(agencies).to.be.an('array');
  });

  it("should get an error due to being passed an invalid region", async function() {
    assert.throws(function() {wrapper.getAgenciesByRegion("flavortown")}, Error);
  });

  it("should get information about a state's agencies", async function() {
    var agencies = await wrapper.getAgenciesByState("TX");
    expect(agencies).to.be.an('object');
  });

  it("should get information about a specific agency", async function() {
    var agencies = await wrapper.getAgencyByORI('MN0480400');
    expect(agencies).to.be.an('object');
  });

});
