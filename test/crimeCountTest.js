require('dotenv').config();

const expect = require('chai').expect;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Crime Frequency Information Calls", function() {

  it("should get information about a crime's frequency (nation-wide)", async function() {
    var information = await wrapper.getCrimeCountByNation("larceny");
    expect(information).to.be.an('array');
  });

  it("should get information about a crime's frequency (region-wide)", async function() {
    var information = await wrapper.getCrimeCountByRegion(3, "larceny");
    expect(information).to.be.an('array');
  });

  it("should get information about a crime's frequency (state-wide)", async function() {
    var information = await wrapper.getCrimeCountByState("AZ", "larceny");
    expect(information).to.be.an('array');
  });

  it("should get information about a crime's frequency (agency-specific)", async function() {
    var information = await wrapper.getCrimeCountByORI("MN0480400", "larceny");
    expect(information).to.be.an('array');
  });

  it("should get detailed statistics about the crimes committed within the jurisdiction of an agency", async function() {
    var information = await wrapper.getCrimeCountByORI("MN0480400", "larceny");
    expect(information).to.be.an('array');
  });

});
