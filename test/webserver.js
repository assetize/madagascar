var WebServer = require("../lib/webserver"),
    should = require("should"),
    port = 1234,
    request = require("request").defaults({baseUrl: "http://localhost:" + port}),
    express = require("express");

describe("WebServer", function(){
  it("registers new routes", function(done){
    var webserver = WebServer();
    var router = express.Router();

    router.get("/foo", function(req ,res){
      res.sendStatus(200);
    });

    webserver.addRoutes("/bla", router);

    webserver.start(port, done);

    request.get("/bla/foo").on("response", function(res){
      res.statusCode.should.be.equal(200);

      webserver.stop();
      
      done();
    });
  });
});

