"use strict";
var Contract = require("./contract"),
    express = require("express"),
    web3 = require("./eth_cmd").web3;

var prvt = Symbol();

module.exports = class ContractRouter{
  constructor(contract){
    if(! contract instanceof Contract){
      throw new Error("ContractRouter must be initialised with an instance of Contract");
    }

    this[prvt] = {
      contract,
      routes: express.Router()
    };

    this._createRoutes();
  }
  _createRoutes(){
    var self = this;

    for(let proc of this[prvt].contract.abi){
      if(proc.type == "function"){
        self[prvt].routes.route("/" + proc.name)
          .get(function(req, res, next){
            res.json(self[prvt].contract[proc.name].call(req.query));
          })
          .post(function(req, res, next){
            self[prvt].contract[proc.name].sendTransaction(req.body, function(err, addr){
              var filter = web3.eth.filter("latest", {address: addr});

              filter.watch(function(){
                var tx = web3.eth.getTransaction(addr);
                
                if(tx.blockNumber){
                  console.log("Transaction accepted:", addr);
                  res.status(200).json({transaction: tx});

                  filter.stopWatching();
                }
              });
            });
          });
      }
    };
  }
  get routes(){
    return this[prvt].routes;
  }
};
