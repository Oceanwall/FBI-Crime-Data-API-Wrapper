require('dotenv').config();

const expect = require('chai').expect;
const assert = require("chai").assert;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Crime Frequency Information Calls", function() {

  // getCrimeCountByNation

  it("should get information about a crime's frequency (nation-wide)", async function() {
    console.log("getCrimeCountByNation");
    var information = await wrapper.getCrimeCountByNation("larceny");
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad type", async function() {
    assert.throws(function() {wrapper.getCrimeCountByNation({})}, Error);
  });

  // getCrimeCountByRegion

  it("should get information about a crime's frequency (region-wide)", async function() {
    console.log("getCrimeCountByRegion");
    var information = await wrapper.getCrimeCountByRegion(3, "larceny");
    expect(information).to.be.an('array');
  });

  it("should get information about a crime's frequency (region-wide)", async function() {
    var information = await wrapper.getCrimeCountByRegion("West", "larceny");
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad (region) type", async function() {
    assert.throws(function() {wrapper.getCrimeCountByRegion({}, "larceny")}, Error);
  });

  it("should get an error due to being passed a bad (crime) type", async function() {
    assert.throws(function() {wrapper.getCrimeCountByRegion("West", 15)}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getCrimeCountByRegion("hello")}, Error);
  });

  // getCrimeCountByState

  it("should get information about a crime's frequency (state-wide)", async function() {
    console.log("getCrimeCountByState");
    var information = await wrapper.getCrimeCountByState("AZ", "larceny");
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad (state) type", async function() {
    assert.throws(function() {wrapper.getCrimeCountByState([], "larceny")}, Error);
  });

  it("should get an error due to being passed a bad (crime) type", async function() {
    assert.throws(function() {wrapper.getCrimeCountByState("AZ", [])}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getCrimeCountByState("yellow")}, Error);
  });

  // getCrimeCountByORI

  it("should get information about a crime's frequency (agency-specific)", async function() {
    console.log("getCrimeCountByORI");
    var information = await wrapper.getCrimeCountByORI("MN0480400", "larceny");
    expect(information).to.be.an('array');
  });

  it("should get an error due to being passed a bad (ORI) type", async function() {
    assert.throws(function() {wrapper.getCrimeCountByORI(undefined, "larceny")}, Error);
  });

  it("should get an error due to being passed a bad (crime) type", async function() {
    assert.throws(function() {wrapper.getCrimeCountByORI("AZ", false)}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getCrimeCountByORI("AZ")}, Error);
  });

  // getCrimesByORI

  it("should get detailed statistics about the larcenies committed within the jurisdiction of an agency", async function() {
    console.log("getCrimesByORI");
    var information = await wrapper.getCrimesByORI("MN0480400", "larceny");
    expect(information).to.be.an('object');
  });

  it("should get detailed statistics about the crimes committed within the jurisdiction of an agency", async function() {
    var information = await wrapper.getCrimesByORI("MN0480400");
    expect(information).to.be.an('array');
  });

  it("should get undefined due to being passed an invalid ORI", async function() {
    var information = await wrapper.getCrimesByORI("yeet");
    expect(information).to.be.undefined;
  });

  // getCrimeByORI

  it("should get detailed statistics about a crime committed within the jurisdiction of an agency", async function() {
    console.log("getCrimeByORI");
    var information = await wrapper.getCrimeByORI("NY0290200", "property-crime");
    expect(information).to.be.an('array');
    expect(information).to.not.be.empty;
  });

  it("should get detailed statistics about a crime committed within the jurisdiction of an agency", async function() {
    var information = await wrapper.getCrimeByORI("NY0290200", "PROPERTy-crime");
    expect(information).to.be.an('array');
    expect(information).to.not.be.empty;
  });

  it("should get an empty array due to being provided an invalid crime category", async function() {
    var information = await wrapper.getCrimeByORI("NY0290200", "memetic-engineering");
    expect(information).to.be.an('array');
    expect(information).to.be.empty;
  });

  it("should get undefined due to being provided an invalid ORI", async function() {
    var information = await wrapper.getCrimeByORI("YEET", "property-crime");
    expect(information).to.be.undefined;
  });

  it("should get an error due to being passed a non-string ORI", async function() {
    assert.throws(function() {wrapper.getCrimeByORI(123, "property-crime")}, Error);
  });

  it("should get an error due to being passed a non-string crime category", async function() {
    assert.throws(function() {wrapper.getCrimeByORI("NY0290200", undefined)}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getCrimeByORI("NY0290200")}, Error);
  });

  // getMultipleCrimesByORI

  it("should get detailed statistics about multiple crimes committed within the jurisdiction of an agency", async function() {
    console.log("getMultipleCrimesByORI");
    var information = await wrapper.getMultipleCrimesByORI("NY0290200", ["property-crime", "arson"]);
    expect(information).to.be.an('array');
    expect(information).to.not.be.empty;
    expect(information[0]).to.not.be.empty;
    expect(information[1]).to.not.be.empty;
  });

  it("should get detailed statistics about a crime committed within the jurisdiction of an agency", async function() {
    var information = await wrapper.getMultipleCrimesByORI("NY0290200", ["arson"]);
    expect(information).to.be.an('array');
    expect(information).to.not.be.empty;
    expect(information[0]).to.not.be.empty;
  });

  it("should immediately get an empty array after being provided with an empty array", async function() {
    var information = await wrapper.getMultipleCrimesByORI("NY0290200", []);
    expect(information).to.be.an('array');
    expect(information).to.be.empty;
  });

  it("should get undefined due to being provided an invalid ORI", async function() {
    var information = await wrapper.getMultipleCrimesByORI("ewqewqeqewqe", ["property-crime", "arson"]);
    expect(information).to.be.undefined;
  });

  it("should get an error due to being passed a non-array", async function() {
    assert.throws(function() {wrapper.getMultipleCrimesByORI("NY0290200", undefined)}, Error);
  });

  it("should get an error due to being passed an inappropriate number of arguments", async function() {
    assert.throws(function() {wrapper.getMultipleCrimesByORI("NY0290200")}, Error);
  });

});
