"use strict";

var ethCmd = require("./eth_cmd"),
    _ = require("lodash");

var prvt = Symbol();

module.exports = class Contract {
  constructor(opt){
    this[prvt] = {};

    if(_.isObject(opt)){
      this.link(opt.address, opt.abi);
    }
  }
  build(src){
    var compiled = ethCmd.web3.eth.compile.solidity(src);

    this[prvt].code = compiled.code;
    this.abi = compiled.info.abiDefinition;
  }
  link(address, abi){
    var code = ethCmd.web3.eth.getCode(address);

    if(code.length <= 2) throw new Error("Contract at " + address + " does not exist.");
    
    this.abi = abi;
    this[prvt].code = code;
  }
  deploy(cb){
    throw new Error("Contract deploys are currently broken and might be dropped");
    
    if(this.address) throw new Error("Contract already deployed.");
    if(!this.code) throw new Error("Deploy requires the contract to have code.");
    if(!this.abi) throw new Error("Deploy requires the contract to have an ABI.");

    var self = this;
    
    ethCmd.createContract(this[prvt].code, function(err, addr){
      console.log(arguments);
      cb(err, self.address = addr);
    });
  }
  get code(){
    return this[prvt].code;
  }
};
