require('dotenv').config();

const expect = require('chai').expect;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Crime Estimates Information Calls", function() {

  it("should get estimated number of crimes (nation-wide)", async function() {
    var information = await wrapper.getCrimeEstimatesByNation();
    expect(information).to.be.an('array');
  });

  it("should get estimated number of crimes (region-wide)", async function() {
    var information = await wrapper.getCrimeEstimatesByRegion(1);
    expect(information).to.be.an('array');
  });

  it("should get estimated number of crimes (state-wide)", async function() {
    var information = await wrapper.getCrimeEstimatesByState('TX');
    expect(information).to.be.an('array');
  });

});
