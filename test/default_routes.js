var settings = require("./test_settings.json"),
    request = require("request").defaults({baseUrl: "http://localhost:" + settings.webserver.port}),
    Madagascar = require("../lib");

describe("Default routes:", function(){
  var madagascar;
  
  before(function(done){
    (madagascar = new Madagascar(settings)).start(function(){
      done();
    });
  });

  after(function(){
    madagascar.kill();
  });
  
  it("status", function(done){
    request.get({
      url: "/status",
      json: true
    }, function(err, res, body){
      if(err) throw err;
      
      res.statusCode.should.be.equal(200);
      
      console.log(body);
      
      body.mining.should.be.a.Boolean;
      body.accounts.should.be.an.Array;
      body.currentBlock.should.be.an.Object;
      
      done();
    });
  });

  it("routes", function(){
    
  });
});
