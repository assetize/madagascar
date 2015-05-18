var Contract = require("../lib/contract"),
    ethCmd = require("../lib/eth_cmd"),
    settings = require("./test_settings.json"),
    fs = require("fs");

describe("Contract", function(){
  describe.skip("if built from source", function(){
    //nice to have, but turns out to be a bit of a pain in the rear
    var contract;
    
    before(function(){
      contract = new Contract();

      contract.build(fs.readFileSync("contracts/simplecoin.sol").toString());
    });

    it("has compiled bytecode", function(){
      contract.code.should.be.a.String;
      contract.code.length.should.be.above(0);
    });

    it("has an abi", function(){
      contract.abi.should.be.an.Array;
      var fnNames = contract.abi.map(function(fn){ return fn.name; });

      fnNames.should.containEql("issue");
      fnNames.should.containEql("balanceOf");
      fnNames.should.containEql("transferTo");
    });
    
    it("can be deployed", function(done){
      (contract.address === undefined).should.be.true;

      contract.deploy(function(err, addr){
        (!!err).should.be.false;
        
        addr.should.be.a.String;
        addr.should.be.equal(contract.address);
        addr.length.should.be.equal(24);

        console.log(2,ethCmd.web3.eth.getCode(addr));

        
        done();
      });
    });
  });

  describe("when linked with an address and abi of an existing contract", function(){
    var contract;
    
    before(function(){
      contract = new Contract({
        address: settings.contract.address,
        abi: settings.contract.abi
      });
    });
    
    it("exposes web3 contract interface", function(){
      contract.balanceOf.should.be.a.Function;
      contract.issue.should.be.a.Function;
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
