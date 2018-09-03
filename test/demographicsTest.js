require('dotenv').config();

const expect = require('chai').expect;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Victim / Offender Demographic Information Calls", function() {

  it("should get information about victims (nation-wide)", async function() {
    var information = await wrapper.getVictimsByNation("larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about victims (region-wide)", async function() {
    var information = await wrapper.getVictimsByRegion(1, "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about victims (state-wide)", async function() {
    var information = await wrapper.getVictimsByState("NM", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about victims (agency-specific)", async function() {
    var information = await wrapper.getVictimsByORI("MN0480400", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about offenders (nation-wide)", async function() {
    var information = await wrapper.getOffendersByNation("larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about offenders (region-wide)", async function() {
    var information = await wrapper.getOffendersByRegion(1, "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about offenders (state-wide)", async function() {
    var information = await wrapper.getOffendersByState("NM", "larceny", "sex");
    expect(information).to.be.an('object');
  });

  it("should get information about offenders (agency-specific)", async function() {
    var information = await wrapper.getOffendersByORI("MN0480400", "larceny", "sex");
    expect(information).to.be.an('object');
  });

});
