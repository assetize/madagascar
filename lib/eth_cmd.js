"use strict";

var web3 = require("web3"),
    settings = require("../settings.json");

var primaryAccount;

var ethCmd = module.exports = {
  web3,
  connect(){
    if(!this.conncted){
      try{
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:'+settings.eth.rpcport));
      }catch(e){
        throw new error("web3 could not connect to the ethereum client", e);
      }

      web3.eth.defaultAccount =  web3.eth.coinbase;
    }
  },
  get connected(){
    return web3.net.listening;
  }
};

function requireConnection(){
  if(!ethCmd.connected) throw new Error("EthCmd is not connected.");
}

ethCmd.connect(); //attempt to connect automatically
