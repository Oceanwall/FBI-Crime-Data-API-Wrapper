require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Agency Information Calls", function() {

  // getAgencies

  it("should get information about (all) agencies", async function() {
    console.log("getAgencies");
    var agencies = await wrapper.getAgencies();
    expect(agencies).to.be.an('object');
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getAgencies(false)}, Error);
  });

  // getAgenciesByCoordinates

  it("should get information about all agencies within 50 km of the provided coordinates", async function() {
    console.log("getAgenciesByCoordinates");
    var agencies = await wrapper.getAgenciesByCoordinates(42.12075, -85.53094);
    expect(agencies).to.be.an('array');
    expect(agencies).to.not.be.empty;
    expect(agencies[0]).to.be.an('object');
  });

  it("should get information about all agencies within 200 km of the provided coordinates", async function() {
    var agencies = await wrapper.getAgenciesByCoordinates(42.12075, -85.53094, 200);
    expect(agencies).to.be.an('array');
    expect(agencies).to.not.be.empty;
    expect(agencies[0]).to.be.an('object');
  });

  it("should get information about all agencies within 0 km of the provided coordinates", async function() {
    var agencies = await wrapper.getAgenciesByCoordinates(42.12075, -85.53094, 0);
    expect(agencies).to.be.an('array');
    expect(agencies).to.have.lengthOf(1);
    expect(agencies[0]).to.be.an('object');
  });

  it("should get an error due to being passed a bad range type", async function() {
    assert.throws(function() {wrapper.getAgenciesByCoordinates(42.12075, -85.53094, true)}, Error);
  });

  it("should get an error due to being passed a negative range", async function() {
    assert.throws(function() {wrapper.getAgenciesByCoordinates(42.12075, -85.53094, -5)}, Error);
  });

  it("should get an error due to being passed a bad latitude type", async function() {
    assert.throws(function() {wrapper.getAgenciesByCoordinates({}, -85.53094)}, Error);
  });

  it("should get an error due to being passed a bad longitude type", async function() {
    assert.throws(function() {wrapper.getAgenciesByCoordinates(42.12075, 'hello')}, Error);
  });

  it("should get an error due to being passed an out of range latitude", async function() {
    assert.throws(function() {wrapper.getAgenciesByCoordinates(-87, -85.53094)}, Error);
  });

  it("should get an error due to being passed an out of range longitude", async function() {
    assert.throws(function() {wrapper.getAgenciesByCoordinates(42.12075, 181)}, Error);
  });

  // getAgenciesByRegion

  it("should get information about (all) agencies", async function() {
    console.log("getAgenciesByRegion");
    var agencies = await wrapper.getAgenciesByRegion("u.s. territories");
    expect(agencies).to.be.an('array');
    expect(agencies[0]).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getAgenciesByRegion([])}, Error);
  });

  it("should get information about a region's agencies", async function() {
    var agencies = await wrapper.getAgenciesByRegion(1);
    expect(agencies).to.be.an('array');
    expect(agencies[0]).to.be.an('object');
  });

  it("should get information about a region's agencies", async function() {
    var agencies = await wrapper.getAgenciesByRegion("south");
    expect(agencies).to.be.an('array');
    expect(agencies[0]).to.be.an('object');
  });

  it("should get an error due to being passed an invalid region", async function() {
    assert.throws(function() {wrapper.getAgenciesByRegion("flavortown")}, Error);
  });

  it("should get an error due to being passed an invalid region", async function() {
    assert.throws(function() {wrapper.getAgenciesByRegion(787)}, Error);
  });

  // getAgenciesByState

  it("should get information about a state's agencies", async function() {
    console.log("getAgenciesByState");
    var agencies = await wrapper.getAgenciesByState("TX");
    expect(agencies).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getAgenciesByState(5)}, Error);
  });

  // getAgencyByORI

  it("should get information about a specific agency", async function() {
    console.log("getAgencyByORI");
    var agencies = await wrapper.getAgencyByORI('MN0480400');
    expect(agencies).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getAgencyByORI(true)}, Error);
  });

});
