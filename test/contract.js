var Contract = require("../lib/contract"),
    Geth = require("./utils/geth"),
    fs = require("fs");

describe("Contract", function(){
  var geth = new Geth();
  
  describe("if built from source", function(){ 
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
    
    it.skip("obtains an address after deploy", function(){
      (coinContract.address === undefined).should.be.true();
      coinContract.deploy();
      coinContract.address.should.be.a.String;
      coinContract.length.should.be.equal(24);
    });
  });

  it.skip("can be linked with an address and abi of an existing contract", function(){
    
  });

  it.skip("can be loaded from the db", function(){
    
  });
});
