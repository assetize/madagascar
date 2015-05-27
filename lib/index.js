"use strict";

var WebServer = require("./webserver"),
    Contract = require("./contract"),
    ContractRouter = require("./contract_router"),
    _ = require("lodash"),
    ethCmd = require("./eth_cmd");

module.exports = _.extend(function(opt){
  var webserver;
  
  var self = {
    start(cb){
      console.log("Starting the web server. Madagascar is greeting you!");
      webserver.start(opt.webserver.port, cb);
      
      return self;
    },
    kill(){
      console.log("Shut... down... EVERYTHING!!!");
      webserver.stop();
    },
    get web3(){
      return ethCmd.web3;
    }
  };
  
  opt = _.merge({
    webserver: {
      port: 8931
    }
  }, opt);

  webserver = new WebServer();


  //TODO: multi-contract init
  //TODO: create contract routers dynamically
  if(opt.contract){
    var contractRouter = ContractRouter(Contract({
      address: opt.contract.address,
      abi: opt.contract.abi
    }));
  }

  webserver.addRoutes("/contract", contractRouter.routes);

  webserver.express.get("/status", function(req, res){//TODO: move to it's own component
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


  return self;
},{
  Contract
});
