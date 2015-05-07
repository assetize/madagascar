var Contract = require("../lib/contract"),
    fs = require("fs");

describe("Contract", function(){
  describe("if compiled from source", function(){
    var coinContract;
    
    before(function(done){
      coinContract = new Contract();

      coinContract.compile(fs.readFileSync("contracts/simplecoin.sol").toString(), function(err){
        if(err) throw err;
        done();
      });
    });
    
    it("returns new address", function(){
      coinContract.address.should.be.a.String;
      coinContract.length.should.be.equal(24);
    });
  });

  it.skip("can be linked with an address and desc", function(){
    
  });

  it.skip("can be loaded from the db", function(){
    
  });
});
