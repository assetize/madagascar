var WebServer = require("../lib/webserver"),
    request = require("request");


describe("WebServer", function(){
  var webserver,
      port = 1234,
      baseUrl = "http://localhost:"+port;
  
  before(function(done){
    webserver = new WebServer();

    webserver.start(port, done);
  });

  it("responds to a status request", function(done){
    request.get(baseUrl + "/status").on("response", function(res){
      res.statusCode.should.be.equal(200);
      done();
    });
  });
});

