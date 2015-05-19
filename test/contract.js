var Contract = require("../lib/contract"),
    ethCmd = require("../lib/eth_cmd"),
    settings = require("./test_settings.json"),
    fs = require("fs");

describe("Contract", function(){
  describe("when linked with an address and abi of an existing contract", function(){
    var contract;
    
    before(function(){
      contract = new Contract({
        address: settings.contract.address,
        abi: settings.contract.abi
      });
    });
    
    it("exposes web3 contract interface", function(){
      contract.balanceOf.sendTransaction.should.be.a.Function;
      contract.issue.sendTransaction.should.be.a.Function;
      contract.balanceOf.call.should.be.a.Function;
      contract.issue.call.should.be.a.Function;
    });
  });


  it("cannot be linked with an address of a contract that doesn't exist", function(){
    (function(){
      var contract = new Contract({
        address: settings.coinContract.address.substr(
          0,
          settings.coinContract.address.length - 1
        ) + "2",
        abi: settings.coinContract.abi
      }); 
    }).should.throw();
  });
});
