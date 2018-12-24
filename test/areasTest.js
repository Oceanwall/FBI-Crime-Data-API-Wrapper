require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Area Information Calls", function() {

  // getStates

  it("should get information about (all) states (page 0)", async function() {
    console.log("getStates");
    var information = await wrapper.getStates();
    expect(information).to.be.an('object');
  });

  it("should get information about (all) states (page 2)", async function() {
    var information = await wrapper.getStates(3);
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getStates(false)}, Error);
  });

  // getStates

  it("should get information about (all) states", async function() {
    console.log("getAllStates");
    var information = await wrapper.getAllStates();
    expect(information).to.be.an('array');
    expect(information).to.not.be.empty;
    expect(information[0]).to.be.an('object');
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getAllStates(false)}, Error);
  });

  // getStatesByRegion

  it("should get information about states in a region", async function() {
    console.log("getStatesByRegion");
    var information = await wrapper.getStatesByRegion(1);
    expect(information).to.be.an('array');
    expect(information).to.not.be.empty;
    expect(information[0]).to.be.an('object');
  });

  it("should get information about states in a region", async function() {
    var information = await wrapper.getStatesByRegion("wEst");
    expect(information).to.be.an('array');
    expect(information).to.not.be.empty;
    expect(information[0]).to.be.an('object');
  });

  it("should get an error due to being passed a bad region", async function() {
    assert.throws(function() {wrapper.getStatesByRegion("nani")}, Error);
  });

  it("should get an error due to being passed a bad region type", async function() {
    assert.throws(function() {wrapper.getStatesByRegion(false)}, Error);
  });

  // getStateByAbbreviation

  it("should get information about a specific state", async function() {
    console.log("getStateByAbbreviation");
    var information = await wrapper.getStateByAbbreviation('MN');
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getStateByAbbreviation([])}, Error);
  });

  // getRegions

  it("should get information about (all) regions", async function() {
    console.log("getRegions");
    var information = await wrapper.getRegions();
    expect(information).to.be.an('array');
  });

  // getRegionsByName

  it("should get information about a specfic region", async function() {
    console.log("getRegionsByName");
    var information = await wrapper.getRegionsByName("Midwest");
    expect(information).to.be.an('object');
  });

  it("should get information about a specfic region", async function() {
    var information = await wrapper.getRegionsByName(1);
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getRegionsByName(undefined)}, Error);
  });

});
