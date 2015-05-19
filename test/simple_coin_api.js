var Madagascar = require("../lib"),
    settings = require("./test_settings.json"),
    request = require("request").defaults({baseUrl: "http://localhost:" + settings.webserver.port}),
    async = require("async");

describe("Simple Coin API", function(){
  var madagascar, bobAddr, aliceAddr, bobBal, aliceBal, issueAmt = 1;
  
  before(function(done){
    madagascar = new Madagascar(settings);

    bobAddr = madagascar.web3.eth.accounts[0];
    aliceAddr = madagascar.web3.eth.accounts[1];

    madagascar.start(function(){
      done();
    });
  });

  after(function(){
    madagascar.kill();
  });

  before(function(done){
    this.timeout(30000);

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

      bobBal = parseInt(results[0], 10);
      aliceBal = parseInt(results[1], 10);

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
      parseInt(body.b,10).should.be.equal(bobBal += issueAmt);

      done();
    });
  });

  describe("after transferring tokens from Bob to Alice", function(){
    var transfAmt = 1;
    
    before(function(done){
      this.timeout(30000);
      
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
        parseInt(body.b,10).should.be.equal(aliceBal += transfAmt);
        done();
      });
    });
  });

});

