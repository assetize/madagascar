"use strict";

var web3 = require("web3"),
    settings = require("../settings.json");

module.exports = {
  connect(){
    try{
      web3.setProvider(new web3.providers.HttpProvider('http://localhost:'+settings.eth.rpcport));
    }catch(e){
      throw new error("web3 could not connect to the ethereum client", e);
    }
  },
  web3,
  get connected(){
    return web3.net.listening;
  }
};
