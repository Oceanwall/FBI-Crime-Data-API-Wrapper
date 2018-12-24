require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Arson Information Calls", function() {

  // getDetailedArsonStatsByNation

  it("should get detailed arson statistics (nation-wide)", async function() {
    console.log("getDetailedArsonStatsByNation");
    var information = await wrapper.getDetailedArsonStatsByNation();
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getDetailedArsonStatsByNation("hello")}, Error);
  });

  // getDetailedArsonStatsByRegion

  it("should get detailed arson statistics (region-wide)", async function() {
    console.log("getDetailedArsonStatsByRegion");
    var information = await wrapper.getDetailedArsonStatsByRegion(2);
    expect(information).to.be.an('array');
  });

  it("should get detailed arson statistics (region-wide)", async function() {
    var information = await wrapper.getDetailedArsonStatsByRegion("U.S. Territories");
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getDetailedArsonStatsByRegion({})}, Error);
  });

  // getDetailedArsonStatsByState

  it("should get detailed arson statistics (state-wide)", async function() {
    console.log("getDetailedArsonStatsByState");
    var information = await wrapper.getDetailedArsonStatsByState('CA');
    expect(information).to.be.an('array');
  });

  // getDetailedArsonStatsByRegion

  it("should get an error due to being passed a bad type", async function() {
    console.log("getDetailedArsonStatsByRegion");
    assert.throws(function() {wrapper.getDetailedArsonStatsByRegion({})}, Error);
  });

});
