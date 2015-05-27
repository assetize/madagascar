var Mdg = require("../lib"),
    settings = require("./test_settings.json"),
    request = require("request").defaults({baseUrl: "http://localhost:" + settings.webserver.port}),
    async = require("async");

describe("Contract API", function(){
  var mdg, bobAddr, aliceAddr, bobBal, aliceBal, issueAmt = 1;
  
  before(function(done){
    //initialising the service and linking up with the contract
    mdg = new Mdg(settings);

    //store 2 ethereum addresses for future use
    bobAddr = mdg.web3.eth.accounts[0];
    aliceAddr = mdg.web3.eth.accounts[1];

    //start the web server
    mdg.start(function(){
      done();
    });
  });

  after(function(){
    //stopping the service
    mdg.kill();
  });

  before(function(done){
    this.timeout(30000);

    //requesting balances for alice and bob stored in the contract storage
    async.parallel([
      function(cb){
        request.get({
          url: "/contract/balanceOf",
          json: true,
          qs: {
            holder: bobAddr
          }
        }, function(err, res, body){ cb(null, body.b); });
      },
      function(cb){
        request.get({
          url: "/contract/balanceOf",
          json: true,
          qs: {
            holder: aliceAddr
          }
        }, function(err, res, body){ cb(null, body.b); });
      }
    ], function(err, results){
      if(err) throw err;

      //storing the received balances
      bobBal = parseInt(results[0], 10);
      aliceBal = parseInt(results[1], 10);

      //issuing new coins to Bob
      request.post({
        url: "/contract/issue",
        json: {
          recipient: bobAddr,
          amount: issueAmt
        }
      }, function(err, res, body){
        if(err) throw err;

        body.transaction.should.be.ok;
        
        done();
      });
    });
  });

  it("assigns issued tokens", function(done){
    request.get({
      url: "/contract/balanceOf",
      qs: {
        holder: bobAddr
      },
      json: true
    }, function(err, res, body){
      //check that Bob's balance is now higher than it used to be by the amount issued
      parseInt(body.b,10).should.be.equal(bobBal += issueAmt);

      done();
    });
  });

  describe("after transferring tokens from Bob to Alice", function(){
    var transfAmt = 1;
    
    before(function(done){
      this.timeout(30000);

      //requesting to transfer some coins from Bob (who also happens to be the transaction sender,
      // or primary address) to Alice
      request.post({
        url: "/contract/transferTo",
        json: {
          recipient: aliceAddr,
          amount: transfAmt
        }
      }, function(err, res, body){
        if(err) throw new err;

        body.transaction.should.be.ok;

        done();
      });
    });

    it("bob's amount went down", function(done){
      request.get({
        url: "/contract/balanceOf",
        qs: {
          holder: bobAddr
        },
        json: true
      }, function(err, res, body){
        //checking that Bob's balance is now less than it used to be
        parseInt(body.b,10).should.be.equal(bobBal -= transfAmt);
        done();
      });
    });

    it("alice's amount went up", function(done){
      request.get({
        url: "/contract/balanceOf",
        qs: {
          holder: aliceAddr
        },
        json: true
      }, function(err, res, body){
        // check that Alice's balance has increased as a result of the transfer
        parseInt(body.b,10).should.be.equal(aliceBal += transfAmt);
        done();
      });
    });
  });

});

