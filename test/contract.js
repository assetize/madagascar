var Contract = require("../lib/contract"),
    settings = require("./test_settings.json"),
    fs = require("fs"),
    ethCmd = require("../lib/eth_cmd");

describe("Contract @now", function(){
  var testInterface = function(contract){
    contract.$.balanceOf.sendTransaction.should.be.a.Function;
    contract.$.issue.sendTransaction.should.be.a.Function;
    contract.$.balanceOf.call.should.be.a.Function;
    contract.$.issue.call.should.be.a.Function;
  };
  
  describe("when linked with an address and abi of an existing contract", function(){
    var contract;
    
    before(function(){
      contract = Contract({
        address: settings.contract.address,
        abi: settings.contract.abi
      });
    });
    
    it("exposes web3 contract interface", function(){
      testInterface(contract);
    });
  });


  it("cannot be linked with an address of a contract that doesn't exist", function(){
    (function(){
      var contract = Contract({
        address: settings.coinContract.address.substr(
          0,
          settings.coinContract.address.length - 1
        ) + "2",
        abi: settings.coinContract.abi
      }); 
    }).should.throw();
  });

  describe("when deployed", function(){
    var contract;
    
    before(function(done){
      this.timeout(30000);
      
      contract = Contract(fs.readFileSync("./test/sample_contracts/simplecoin.sol").toString());

      contract.deploy();

      contract.on("deployed", function(addr){
        addr.length.should.be.above(2);
        done();
      });
    });

    it("gets an abi", function(){
      console.log("get abi", contract);
      contract.abi.should.be.an.Array;
    });
    
    it("gets an address", function(){
      contract.address.length.should.be.above(2);
    });

    it("exposes web3 contract interface", function(){
      
    });
  });
});
