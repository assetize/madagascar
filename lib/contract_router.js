"use strict";
var Contract = require("./contract"),
    express = require("express"),
    web3 = require("./eth_cmd").web3;

module.exports = function(contract){
  var routes = express.Router();
  
  var self = {
    get routes(){ return routes; }
  };
  
  if(! contract instanceof Contract){
    throw new Error("ContractRouter must be initialised with an instance of Contract");
  }

  for(let proc of contract.abi){
    if(proc.type == "function"){
      routes.route("/" + proc.name).get(function(req, res, next){
        res.json(contract.$[proc.name].call(req.query));
      }).post(function(req, res, next){
        contract[proc.name].sendTransaction(req.body, function(err, addr){

          contract.on("tx_confirmed:"+addr, function(){
            res.status(200).json({transaction: web3.eth.getTransaction(addr)});
          });
        });
      });
    }
  };

  return self;
};
