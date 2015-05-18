"use strict";

var express = require("express"),
    bodyParser = require('body-parser');

var prvt = Symbol();

module.exports = class WebServer {
  constructor(){
    this[prvt] = {
      express: express()
    };

    this.express.get("/status", function(req, res){
      res.sendStatus(200);
    });

    this.express.use(bodyParser.json());
  }
  start(port, cb){
    var listener = this.express.listen(port, function(){
      console.log("Listening on port", listener.address().port);
      cb && cb();
    });
  }
  addRoutes(rootPath, routes){
    this[prvt].express.use(rootPath, routes);
  }
  get express(){
    return this[prvt].express;
  }
};



