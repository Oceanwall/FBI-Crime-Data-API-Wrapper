require('dotenv').config();

const expect = require('chai').expect;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Arson Information Calls", function() {

  it("should get detailed arson statistics (nation-wide)", async function() {
    var information = await wrapper.getDetailedArsonStatsByNation();
    expect(information).to.be.an('array');
  });

  it("should get detailed arson statistics (region-wide)", async function() {
    var information = await wrapper.getDetailedArsonStatsByRegion(2);
    expect(information).to.be.an('array');
  });

  it("should get detailed arson statistics (state-wide)", async function() {
    var information = await wrapper.getDetailedArsonStatsByState('CA');
    expect(information).to.be.an('array');
  });

});
