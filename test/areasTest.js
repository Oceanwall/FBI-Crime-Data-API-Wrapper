require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Area Information Calls", function() {

  it("should get information about (all) states (page 0)", async function() {
    var information = await wrapper.getStates();
    expect(information).to.be.an('object');
  });

  it("should get information about (all) states (page 2)", async function() {
    var information = await wrapper.getStates(3);
    expect(information).to.be.an('object');
  });

  it("should get information about (all) states", async function() {
    var information = await wrapper.getAllStates();
    expect(information).to.be.an('array');
    expect(information).to.not.be.empty;
    expect(information[0]).to.be.an('object');
  });

  it("should get information about states in a region", async function() {
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
