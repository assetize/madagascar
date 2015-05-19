"use strict";

var express = require("express"),
    bodyParser = require('body-parser');

var prvt = Symbol();

module.exports = class WebServer {
  constructor(){
    this[prvt] = {
      express: express()
    };

    this.express.use(bodyParser.json());
  }
  start(port, cb){
    var self = this;
    self.listener = this.express.listen(port, function(){
      console.log("Web server listening on port", self.listener.address().port);
      cb && cb();
    });
  }
  stop(){
    console.log("Stopping the web server");
    this.listener.close();
  }
  addRoutes(rootPath, routes){
    this[prvt].express.use(rootPath, routes);
  }
  get express(){
    return this[prvt].express;
  }
};



