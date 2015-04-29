var should = require("should"),
    Madagascar = require("../lib"),
    requireDir = require("require-directory"),
    request = require("request");


describe("Madagascar", function(){
  var testOpt = {},
      baseUrl;
  
  before(function(done){
    testOpt.app = new Madagascar(baseUrl = require("../settings.json"));

    done();
  });

  // it("Starts a web server", function(done){
  //   request.get(baseUrl + "/status").on("response", function(res){
  //     res.statusCode.should.be.equal(200);
  //     done();
  //   });
  // });

  requireDir(module, {
    recurse: false,
    visit: function(mod){
      mod();
    }
  });
});
