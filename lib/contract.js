"use strict";

var ethCmd = require("./eth_cmd"),
    _ = require("lodash");

module.exports = function(opt){
  var abi, address, sol, name;
  
  var self = _.extend({
    $: {},
    get abi(){
      //console.log("abi:", abi);
      return abi;
    },
    get address(){
      return address;
    },
    get name(){
      return name;
    },
    deploy(){
      if(!sol) throw new Error("No Solidity source found");

      var compiled = ethCmd.web3.eth.compile.solidity(sol);

      if(_.keys(compiled) > 1) throw new Error("Batch contract compilation not supported.");

      abi = compiled[name = _.keys(compiled)[0]].info.abiDefinition;
      //console.log("set abi:", abi);
      console.log("SELF2",self);

      ethCmd.web3.eth.sendTransaction({
        data: compiled[name].code,
        gas: "1000000",
        gasPrice: ethCmd.web3.eth.gasPrice.toString()
      }, function(err, addr){
        if(err) throw err;
        
        address = addr;
        console.log("Deploying contract at:", addr);

        ethCmd.waitFor({filter: {address}}, function(){
          return ethCmd.web3.eth.getCode(address).length > 2;
        }, function(err){
          if(err) throw err;
          
          self.emit("deployed",address);
        });
      });
    }
  }, require("events").EventEmitter.prototype);
      
  if(_.isObject(opt)){
    abi = opt.abi;
    address = opt.address;
    name = opt.name;
    console.log("SELF1", self.abi);
    link(opt.address, opt.abi);
  } else if(_.isString(opt)){
    sol = opt;
  }


  function link(address, abi){
    var code = ethCmd.web3.eth.getCode(address);
    
    if(code.length <= 2) throw new Error("Contract at " + address + " does not exist.");

    var foo;
    _.each(foo = ethCmd.web3.eth.contract(abi).at(address), function(item, name){
      var abiEntry = _.findWhere(abi, {name});

      if(_.isFunction(item) && abiEntry){
        self.$[name] = _.extend({}, item, {
          call(inputs, cb){
            return outputsToObj(abiEntry, item.call.apply(null, inputsToArr(abiEntry, inputs)));
          },
          sendTransaction(inputs, cb){
            return item.sendTransaction
              .apply(null, inputsToArr(abiEntry, inputs).concat(function(err, data){
                if(err) throw err;
                
                console.log("Transaction sent:", data);
                
                cb(err, data);
              }));
          }
        });
      }
      return self;
    });
  }

  function inputsToArr(abiEntry,inputs){
    return _.map(abiEntry.inputs, function(inp){ return inputs[inp.name]; });
  }

  //TODO: type conversion
  function outputsToObj(abiEntry, outputs){
    outputs = _.isArray(outputs) ? outputs : [outputs];
    
    return _.reduce(abiEntry.outputs, function(res, out, i){
      res[out.name] = outputs[i];
      return res;
    }, {});
  }
  
  return self;
};

