require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Police Employment Information Calls", function() {

  // getPoliceByNation

  it("should get (nation-wide) police employment information", async function() {
    console.log("getPoliceByNation");
    var information = await wrapper.getPoliceByNation();
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getPoliceByNation("East")}, Error);
  });

  // getPoliceByRegion

  it("should get (region-wide) police employment information", async function() {
    console.log("getPoliceByRegion");
    var information = await wrapper.getPoliceByRegion(2);
    expect(information).to.be.an('array');
  });

  it("should get (region-wide) police employment information", async function() {
    var information = await wrapper.getPoliceByRegion("Other");
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad region", async function() {
    assert.throws(function() {wrapper.getPoliceByRegion("5")}, Error);
  });

  it("should get an error due to being passed a bad region", async function() {
    assert.throws(function() {wrapper.getPoliceByRegion("NANI")}, Error);
  });

  it("should get undefined due to being passed a bad region type", async function() {
    assert.throws(function() {wrapper.getPoliceByRegion({})}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getPoliceByRegion(1, 2, 3)}, Error);
  });

  // getPoliceByState

  it("should get (state-wide) police employment information", async function() {
    console.log("getPoliceByState");
    var information = await wrapper.getPoliceByState("GA");
    expect(information).to.be.an('array');
  });

  it("should get undefined due to being passed a bad state", async function() {
    var information = await wrapper.getPoliceByState("yare yare daze");
    expect(information).to.be.undefined;
  });

  it("should get an error due to being passed a bad state type", async function() {
    assert.throws(function() {wrapper.getPoliceByState(1)}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getPoliceByState("GA", 2, 3)}, Error);
  });

  // getPoliceByORI

  it("should get (agency-specific) police employment information", async function() {
    console.log("getPoliceByORI");
    var information = await wrapper.getPoliceByORI('MN0480400');
    expect(information).to.be.an('array');
  });

  it("should get undefined due to being passed a bad ORI", async function() {
    var information = await wrapper.getPoliceByORI("ZA WaRuDo");
    expect(information).to.be.undefined;
  });

  it("should get an error due to being passed a bad ORI type", async function() {
    assert.throws(function() {wrapper.getPoliceByORI(null)}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getPoliceByORI("MN0480400", 2, 3)}, Error);
  });

});
