var Madagascar = require("../lib"),
    settings = require("./test_settings.json"),
    request = require("request").defaults({baseUrl: "http://localhost:" + settings.webserver.port});

describe("Simple Coin API", function(){
  var fooAddr = settings.addresses[0];
  
  before(function(done){
    var api = new Madagascar(settings);

    api.start(function(){
      done();
    });
  });

  it("@now", function(done){
    var web3 = require("web3");
    var c = web3.eth.contract(settings.contract.abi).at(settings.contract.address);

    c.issue.sendTransaction(settings.addresses[0], 1,{from: web3.eth.coinbase}, function(){
      console.log(arguments);
      done();
    });
  });

  it("issues tokens", function(done){
    this.timeout(30000);

    //TODO: check balance first, then test for balance+amount
    request.post({
      url: "/contract/issue",
      json: {
        recipient: fooAddr,
        amount: 1
      }
    }).on("response", function(res){
      request.get({
        url: "/contract/balanceOf",
        qs: {
          holder: fooAddr
        }
      }).on("response", function(res){
        console.log(res.body);
        res.body.b.should.be.equal(1);
        done();
      });
    });
  });

  it("transfers tokens", function(){
    
  });
});
