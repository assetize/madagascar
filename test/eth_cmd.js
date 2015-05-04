var ethCmd = require("../lib/eth_cmd"),
    utils = require("./utils");

describe("ethCmd", function(){
  before(function(){
    ethCmd.connect();
  });

  it("should connect to the eth client", function(){
    ethCmd.connected.should.be.true;
  });
});

