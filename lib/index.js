"use strict";

var WebServer = require("./webserver"),
    Contract = require("./contract"),
    ContractRouter = require("./contract_router"),
    _ = require("lodash"),
    ethCmd = require("./eth_cmd");

var prvt = Symbol();

module.exports = class Madagascar{
  constructor(opt){
    var self = this;
    
    (this[prvt] = {}).opt = _.merge({
      webserver: {
        port: 8931
      }
    }, opt);

    
    this.webserver = new WebServer();

    ethCmd.connect();

    var contractRouter = new ContractRouter(new Contract({
      address: opt.contract.address,
      abi: opt.contract.abi
    }));

    this.webserver.addRoutes("/contract", contractRouter.routes);

    this.webserver.express.get("/status", function(req, res){//TODO: move to it's own component
      res.status(200).json({
        mining: self.web3.eth.mining,
        currentBlock: self.web3.eth.getBlock("latest"),
        accounts: self.web3.eth.accounts.map(function(acc){

          return _.extend({
            address: acc,
            balance: self.web3.fromWei(self.web3.eth.getBalance(acc), "ether") + " ether"
          }, (acc == self.web3.eth.defaultAccount) && {primary: true});
        })
      });
    });
  }
  start(cb){
    console.log("Starting the web server. Madagascar is greeting you!");
    this.webserver.start(this[prvt].opt.webserver.port, cb);
    
    return this;
  }
  kill(){
    console.log("Shut... down... EVERYTHING!!!");
    this.webserver.stop();
  }
  get web3(){
    return ethCmd.web3;
  }
};
