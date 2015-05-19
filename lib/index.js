"use strict";

var WebServer = require("./webserver"),
    Contract = require("./contract"),
    ContractRouter = require("./contract_router"),
    _ = require("lodash"),
    ethCmd = require("./eth_cmd");

var prvt = Symbol();

module.exports = class Madagascar{
  constructor(opt){
    (this[prvt] = {}).opt = _.merge({
      webserver: {
        port: 8931
      }
    }, opt);

    
    this.webserver = new WebServer();

    var contractRouter = new ContractRouter(new Contract({
      address: opt.contract.address,
      abi: opt.contract.abi
    }));

    this.webserver.addRoutes("/contract", contractRouter.routes);

    ethCmd.connect();
  }
  start(cb){
    this.webserver.start(this[prvt].opt.webserver.port, cb);
  }
  get web3(){
    return ethCmd.web3;
  }
};
