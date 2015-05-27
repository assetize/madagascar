#!/usr/bin/env node

var web3 = require("web3"),
    fs = require("fs"),
    _ = require("lodash");


var cFile = process.argv[2];

if(!cFile){
  usage();
  process.exit();
}


web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var cCode = fs.readFileSync(cFile).toString(),
    compiled = _.values(web3.eth.compile.solidity(cCode))[0];

console.log("ABI:",JSON.stringify(compiled.info.abiDefinition, null, 2));

//console.log(web3.eth.getCode('0x0af80bad2f44f3d87215c9c4e81798451a821375'));
//process.exit();
//TODO: calculate total cost and ask to confirm

web3.eth.sendTransaction({
  from: web3.eth.coinbase,
  data: compiled.code,
  gas: "1000000"
}, function(err, addr){
  if(err) throw err;
  console.log("Deploying contract at:", addr);

  //TODO: add counter
  web3.eth.filter("latest", {
    address: addr
  }).watch(function(){
    if(web3.eth.getCode(addr).length > 2){
      console.log("Contract deployed successfully");
      process.exit();
    }else{
      console.log("Not deployed yet, waiting for the next block ...");
    }
    
  });
});

function usage(){
  console.log("Usage:" + "$deploy_contract.js <path-to-contract>");
}
