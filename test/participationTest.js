require('dotenv').config();

const expect = require('chai').expect;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Agency Data Reporting Participation Information Calls", function() {

  it("should get agency data reporting participation statistics (nation-wide)", async function() {
    var information = await wrapper.getParticipationByNation();
    expect(information).to.be.an('array');
  });

  it("should get agency data reporting participation statistics (region-wide)", async function() {
    var information = await wrapper.getParticipationByRegion("West");
    expect(information).to.be.an('array');
  });

  it("should get agency data reporting participation statistics (state-wide)", async function() {
    var information = await wrapper.getParticipationByState("TX");
    expect(information).to.be.an('array');
  });

  it("should get agency data reporting participation statistics (agency-wide)", async function() {
    var information = await wrapper.getParticipationByORI("MN0480400");
    expect(information).to.be.an('array');
  });

});
