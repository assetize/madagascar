"use strict";
var Contract = require("./contract"),
    express = require("express");

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
            res.json(self[prvt].contract[proc.name].sendTransaction(req.body));
          });
      }
    };
  }
  get routes(){
    return this[prvt].routes;
  }
};
