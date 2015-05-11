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
      abi: contract.abi,
      routes: express.Router()
    };

    this._createRoutes();
  }
  _createRoutes(){
    var self = this;

    for(let proc of this[prvt].abi){
      if(proc.type == "function"){
        self[prvt].routes.route("/" + proc.name)
          .get(function(req, res, next){
            next(new Error("not implemented"));
          })
          .post(function(req, res, next){
            next(new Error("not implemented"));
          });
      }
    };
  }
  get routes(){
    return this[prvt].routes;
  }
};
