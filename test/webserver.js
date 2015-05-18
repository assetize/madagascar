var WebServer = require("../lib/webserver"),
    should = require("should"),
    request = require("request"),
    express = require("express");


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

  it("registers new routes", function(done){
    var router = express.Router();

    router.get("/foo", function(req ,res){
      res.sendStatus(200);
    });

    webserver.addRoutes("/bla", router);

    webserver.start();

    request.get(baseUrl + "/bla/foo").on("response", function(res){
      res.statusCode.should.be.equal(200);
      done();
    });
  });
});

