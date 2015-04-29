"use strict";

var WebServer = require("./webserver"),
    _ = require("lodash");

module.exports = class Madagascar{
  constructor(opt){
    opt = _.merge({
      webserver: {
        port: 8931
      }
    }, opt);

    this.webserver = new WebServer({port: opt.webserver.port});
  }
};
