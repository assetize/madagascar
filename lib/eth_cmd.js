"use strict";

var web3 = require("web3"),
    settings = require("../settings.json");

var primaryAccount,
    connected = false;



var ethCmd = module.exports = {
  connect(){
    if(!this.connected){
      try{
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:'+settings.eth.rpcport));
      }catch(e){
        throw new Error("web3 could not connect to the ethereum client", e);
      }

      web3.eth.defaultAccount =  web3.eth.coinbase;
      connected = true;
      
      console.log("eth_cmd connected");
      console.log("default account:", web3.eth.defaultAccount);
    }
  },
  waitFor(opt, test, cb){
    var filter = web3.eth.filter("latest", opt.filter),
        attempts = 3 || opt.attempts,
        counter = 0;

    filter.watch(function(){
      if(test()){
        cb();
        filter.stopWatching();
      }else if(counter++ >= attempts){
        cb(new Error("waitFor terminated after " + counter + " attempts"));
        filter.stopWatching();
      }
    });
  },
  get connected(){
    return connected;
  },
  get web3(){
    if(this.connected){
      return web3;
    }else{
      throw new Error("EthCmd is not connected.")
    }
  }
};

ethCmd.connect(); //connect automatically by default 
