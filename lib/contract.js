"use strict";

var ethCmd = require("./eth_cmd"),
    _ = require("lodash");

var prvt = Symbol();

module.exports = class Contract {
  constructor(opt){
    this[prvt] = {
      abi: opt.abi
    };

    if(_.isObject(opt)){
      link(this, opt.address, opt.abi);
    }
  }
  get abi(){
    return this[prvt].abi;
  }
};

function link(contract, address, abi){
  var code = ethCmd.web3.eth.getCode(address),
      web3Contract;
  
  if(code.length <= 2) throw new Error("Contract at " + address + " does not exist.");

  _.reduce(web3Contract = ethCmd.web3.eth.contract(abi).at(address), function(contract,item, name){
    var abiEntry = _.findWhere(abi, {name});

    if(_.isFunction(item) && abiEntry){
      contract[name] = _.extend({}, item, {
        call(inputs, cb){
          return item.call.apply(null, inputsToArr(abiEntry, inputs).concat(function(err, data){
            if(err) throw err;
            
            cb(err, data);
          }));
        },
        sendTransaction(inputs, cb){
          console.log(inputsToArr(abiEntry, inputs).concat({
            from: ethCmd.web3.eth.coinbase
          }).concat(function(err, data){
            if(err) throw err;
            cb(err, data);
          }));
          return item.sendTransaction
            .apply(null, inputsToArr(abiEntry, inputs).concat({
              from: ethCmd.web3.eth.coinbase
            }).concat(function(err, data){
              if(err) throw err;
              console.log("DATA", typeof data);
              cb(err, data);
            }));
        }
      });
    }else{
      contract[name] = item;
    }
    return contract;
  }, contract);
}

function inputsToArr(abiEntry,inputs){
  return _.map(abiEntry.inputs, function(inp){ return inputs[inp.name]; });
}
