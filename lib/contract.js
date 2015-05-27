"use strict";

var ethCmd = require("./eth_cmd"),
    _ = require("lodash");

module.exports = function(opt){
  var abi, address, sol, name;
  
  var self = _.extend({
    $: {},
    get abi(){
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
          
          link();
          
          self.emit("deployed",address);
        });
      });
    }
  }, require("events").EventEmitter.prototype);
  
  if(_.isObject(opt)){
    abi = opt.abi;
    address = opt.address;
    name = opt.name;

    link();
  } else if(_.isString(opt)){
    sol = opt;
  }


  function link(){
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
            var txCb = function(err, txAddr){
              if(err) return cb(err);

              console.log("Sent transaction:",txAddr);
              
              cb && cb(null, txAddr);
              
              ethCmd.waitFor({filter: {address:txAddr}}, function(){
                return ethCmd.web3.eth.getTransaction(txAddr).blockNumber;
              }, function(err){
                if(err) throw err;

                console.log("Transaction confirmed:", txAddr);
                self.emit("tx_confirmed:"+txAddr);
              });
            };
            
            item.sendTransaction.apply(null, inputsToArr(abiEntry, inputs).concat(txCb));
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

