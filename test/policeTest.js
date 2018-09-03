require('dotenv').config();

const expect = require('chai').expect;

const FBI_Wrapper = require("../src/FBI_Wrapper");
let wrapper = new FBI_Wrapper(process.env.API_KEY);

describe("FBI UCR Wrapper, Police Employment Information Calls", function() {

  it("should get (nation-wide) police employment information", async function() {
    var information = await wrapper.getPoliceByNation();
    expect(information).to.be.an('array');
  });

  it("should get (region-wide) police employment information", async function() {
    var information = await wrapper.getPoliceByRegion(2);
    expect(information).to.be.an('array');
  });

  it("should get (state-wide) police employment information", async function() {
    var information = await wrapper.getPoliceByState("GA");
    expect(information).to.be.an('array');
  });

  it("should get (agency-specific) police employment information", async function() {
    var information = await wrapper.getPoliceByORI('MN0480400');
    expect(information).to.be.an('array');
  });

});
