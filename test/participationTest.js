require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Agency Data Reporting Participation Information Calls", function() {

  // getParticipationByNation

  it("should get agency data reporting participation statistics (nation-wide)", async function() {
    console.log("getParticipationByNation");
    var information = await wrapper.getParticipationByNation();
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getParticipationByNation("East")}, Error);
  });

  // getParticipationByRegion

  it("should get agency data reporting participation statistics (region-wide)", async function() {
    console.log("getParticipationByRegion");
    var information = await wrapper.getParticipationByRegion("West");
    expect(information).to.be.an('array');
  });

  it("should get agency data reporting participation statistics (region-wide)", async function() {
    var information = await wrapper.getParticipationByRegion(2);
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad region", async function() {
    assert.throws(function() {wrapper.getParticipationByRegion("omae mo shindeiru")}, Error);
  });

  it("should get an error due to being passed a bad region type", async function() {
    assert.throws(function() {wrapper.getParticipationByRegion({})}, Error);
  });

  it("should get agency data reporting participation statistics (state-wide)", async function() {
    var information = await wrapper.getParticipationByState("TX");
    expect(information).to.be.an('array');
  });

  it("should get undefined due to being passed a bad state", async function() {
    assert.throws(function() {wrapper.getParticipationByRegion("united states of america")}, Error);
  });

  it("should get an error due to being passed a bad state type", async function() {
    assert.throws(function() {wrapper.getParticipationByRegion(null)}, Error);
  });

  // getParticipationByORI

  it("should get agency data reporting participation statistics (agency-wide)", async function() {
    console.log("getParticipationByORI");
    var information = await wrapper.getParticipationByORI("MN0480400");
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad ORI type", async function() {
    assert.throws(function() {wrapper.getParticipationByORI(undefined)}, Error);
  });

  it("should get undefined due to being passed a bad ORI", async function() {
    var information = await wrapper.getParticipationByORI("united states of smash");
    expect(information).to.be.undefined;
  });

});
