"use strict";

var ethCmd = require("./eth_cmd"),
    _ = require("lodash");

var prvt = Symbol();

module.exports = class Contract {
  build(src){
    var compiled = ethCmd.web3.eth.compile.solidity(src);
    
    _.extend(this[prvt] = {}, {
      src,
      code: compiled.code,
      abi: compiled.info.abiDefinition
    });
  }
  set abi(abi){
    this[prvt].abi = abi;
  }
  get abi(){
    return this[prvt].abi;
  }
  get code(){
    return this[prvt].code;
  }
};
