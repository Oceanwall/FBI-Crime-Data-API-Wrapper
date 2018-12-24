require('dotenv').config();

const expect = require('chai').expect;
const assert = require('chai').assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Victim / Offender Demographic Information Calls", function() {

  // getVictimsByNation

  it("should get information about victims (nation-wide)", async function() {
    console.log("getVictimsByNation");
    var information = await wrapper.getVictimsByNation("larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByNation(111, "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByNation("larceny", null)}, Error);
  });

  // getVictimsByRegion

  it("should get information about victims (region-wide)", async function() {
    console.log("getVictimsByRegion");
    var information = await wrapper.getVictimsByRegion(1, "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about victims (region-wide)", async function() {
    var information = await wrapper.getVictimsByRegion("West", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByRegion(undefined, "larceny", "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByRegion("West", 555, "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByRegion("West", "larceny", {type: "sex"})}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getVictimsByRegion("East", "larceny")}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getVictimsByRegion("East", "larceny", "sex", "git")}, Error);
  });

  // getVictimsByState

  it("should get information about victims (state-wide)", async function() {
    console.log("getVictimsByState");
    var information = await wrapper.getVictimsByState("NM", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByState(undefined, "larceny", "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByState("NM", 555, "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByState("NM", "larceny", {type: "sex"})}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getVictimsByState("TX", "larceny")}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getVictimsByState("TX", "larceny", "sex", "git")}, Error);
  });

  // getVictimsByORI

  it("should get information about victims (agency-specific)", async function() {
    console.log("getVictimsByORI");
    var information = await wrapper.getVictimsByORI("MN0480400", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByORI(undefined, "larceny", "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByORI("MN0480400", 555, "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getVictimsByORI("MN0480400", "larceny", {type: "sex"})}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getVictimsByORI("MN0480400", "larceny")}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getVictimsByORI("MN0480400", "larceny", "sex", "git")}, Error);
  });

  // getOffendersByNation

  it("should get information about offenders (nation-wide)", async function() {
    console.log("getOffendersByNation");
    var information = await wrapper.getOffendersByNation("larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByNation(undefined, "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByNation("larceny", [])}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getOffendersByNation("larceny")}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getOffendersByNation("larceny", "sex", 3)}, Error);
  });

  // getOffendersByRegion

  it("should get information about offenders (region-wide)", async function() {
    console.log("getOffendersByRegion");
    var information = await wrapper.getOffendersByRegion(1, "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about offenders (region-wide)", async function() {
    var information = await wrapper.getOffendersByRegion("West", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByRegion(undefined, "larceny", "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByRegion(2, 555, "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByRegion(1, "larceny", {type: "sex"})}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getOffendersByRegion("West", "larceny")}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getOffendersByRegion(4, "larceny", "sex", "git")}, Error);
  });

  // getOffendersByState

  it("should get information about offenders (state-wide)", async function() {
    console.log("getOffendersByState");
    var information = await wrapper.getOffendersByState("TX", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByState(null, "larceny", "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByState("TX", 555, "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByState("TX", "larceny", ["sex"])}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getOffendersByState("TX", "larceny")}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getOffendersByState("TX", "larceny", "sex", "git")}, Error);
  });

  // getOffendersByORI

  it("should get information about offenders (agency-specific)", async function() {
    console.log("getOffendersByORI");
    var information = await wrapper.getOffendersByORI("MN0480400", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByORI(undefined, "larceny", "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByORI("MN0480400", 111, "sex")}, Error);
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getOffendersByORI("MN0480400", "larceny", null)}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getOffendersByORI("MN0480400", "larceny")}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getOffendersByORI("MN0480400", "larceny", "sex", "git")}, Error);
  });

});
