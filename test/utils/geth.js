"use strict";

var net = require("net");

module.exports = class Geth {
  constructor(){
    var self = this;
    before(function(done){
      self.runnerC = net.connect("/tmp/gethrunner.sock", function(){
        console.log("connected to server");
        done();
      });

      self.runnerC.on("data", function(data){
        console.log("RUNNER:", data.toString());
      });

      self.runnerC.on("end", function(){
        console.log("Disconnected from server");
        self.runnerC.end();
      });
    });

    after(function(){
      self.runnerC.end();
    });
  }
  startMining(){
    this.runnerC.write("mineStart");
  }
  stopMining(){
    this.runnerC.write("mineStop");
  }
};
