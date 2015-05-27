var Contract = require("../lib/contract"),
    settings = require("./test_settings.json"),
    fs = require("fs"),
    ethCmd = require("../lib/eth_cmd");

describe("Contract", function(){
  var testInterface = function(contract){
    contract.$.balanceOf.sendTransaction.should.be.a.Function;
    contract.$.issue.sendTransaction.should.be.a.Function;
    contract.$.balanceOf.call.should.be.a.Function;
    contract.$.issue.call.should.be.a.Function;
  };
  

  var contract;
  
  before(function(done){
    this.timeout(30000);

    ethCmd.web3.eth.accounts.length.should.be.above(1);
    
    contract = Contract(fs.readFileSync("./test/sample_contracts/simplecoin.sol").toString());

    contract.deploy();

    contract.on("deployed", function(addr){
      addr.length.should.be.above(2);
      done();
    });
  });

  it("gets an abi", function(){
    contract.abi.should.be.an.Array;
  });
  
  it("gets an address", function(){
    contract.address.length.should.be.above(2);
  });

  it("exposes web3 contract interface", function(){
    testInterface(contract);
  });

  it("allows making calls", function(){
    contract.$.balanceOf.call({holder: ethCmd.web3.eth.accounts[0]}).b.toString()
      .should.be.equal("0");
  });

  it("allows sending transactions", function(done){
    this.timeout(20000);
    
    contract.$.issue.sendTransaction({
      recipient: ethCmd.web3.eth.accounts[0],
      amount: 1
    }, function(err, addr){
      if(err) throw err;
      
      contract.on("tx_confirmed:"+addr, done);
    });
  });

  describe("when linked with an address and abi of an existing contract", function(){
    var contract2;
    
    before(function(){
      contract2 = Contract({
        address: contract.address,
        abi: contract.abi
      });
    });
    
    it("exposes web3 contract interface", function(){
      testInterface(contract2);
    });
  });


});
