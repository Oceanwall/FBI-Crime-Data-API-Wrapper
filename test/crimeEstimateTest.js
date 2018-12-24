require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Crime Estimates Information Calls", function() {

  // getCrimeEstimatesByNation

  it("should get estimated number of crimes (nation-wide)", async function() {
    console.log("getCrimeEstimatesByNation");
    var information = await wrapper.getCrimeEstimatesByNation();
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getCrimeEstimatesByNation("yeet")}, Error);
  });

  // getCrimeEstimatesByRegion

  it("should get estimated number of crimes (region-wide)", async function() {
    console.log("getCrimeEstimatesByRegion");
    var information = await wrapper.getCrimeEstimatesByRegion(1);
    expect(information).to.be.an('array');
  });

  it("should get estimated number of crimes (region-wide)", async function() {
    var information = await wrapper.getCrimeEstimatesByRegion("otHeR");
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getCrimeEstimatesByRegion([])}, Error);
  });

  // getCrimeEstimatesByState

  it("should get estimated number of crimes (state-wide)", async function() {
    console.log("getCrimeEstimatesByState");
    var information = await wrapper.getCrimeEstimatesByState('TX');
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getCrimeEstimatesByState(undefined)}, Error);
  });

});
