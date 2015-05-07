var ethCmd = require("../lib/eth_cmd");


describe("ethCmd", function(){
  before(function(){
    ethCmd.connect();
  });

  it("should connect to the eth client", function(){
    ethCmd.connected.should.be.true;
  });

  it("should expose web3", function(){
    ethCmd.web3.should.be.eql(require("web3"));
  });
});

