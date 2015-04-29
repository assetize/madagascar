"use strict";

var express = require("express");

module.exports = class WebServer {
  constructor(){
    this.server = express();

    this.server.get("/status", function(req, res){
      res.sendStatus(200);
    });
  }
  start(port, cb){
    var listener = this.server.listen(port, function(){
      console.log("Listening on port", listener.address().port);
      cb();
    });
  }
}



