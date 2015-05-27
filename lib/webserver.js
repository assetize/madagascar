"use strict";

var Express = require("express"),
    bodyParser = require('body-parser');

module.exports = function(){
  var express = Express();
  
  var self = {
    start(port, cb){
      var self = this;
      self.listener = this.express.listen(port, function(){
        console.log("Web server listening on port", self.listener.address().port);
        cb && cb();
      });
    },
    stop(){
      console.log("Stopping the web server");
      this.listener.close();
    },
    addRoutes(rootPath, routes){
      express.use(rootPath, routes);
    },
    get express(){
      return express;
    }
  };

  express.use(bodyParser.json());

  return self;
};



