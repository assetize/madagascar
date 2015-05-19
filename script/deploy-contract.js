#!/usr/bin/env node

var web3 = require("web3"),
    fs = require("fs");


var cFile = process.argv[2];



if(!cFile){
  usage();
  process.exit();
}


web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var cCode = fs.readFileSync(cFile).toString(),
    compiled = web3.eth.compile.solidity(cCode);

console.log("ABI:",JSON.stringify(compiled.info.abiDefinition, null, 2));

var block = web3.eth.blockNumber;


web3.eth.sendTransaction({
  from: web3.eth.coinbase,
  data: compiled.code,
  gas: "1000000",
  gasPrice: "10000"
}, function(err, addr){
  if(err) throw err;
  console.log("Deploying contract at:", addr);

  web3.eth.filter("latest", {
    address: addr
  }).watch(function(){
    if(web3.eth.getCode(addr).length > 2){
      console.log("Contract deployed successfully");
      process.exit();
    }else{
      console.log("Not deployed yet, waiting for next block ...");
    }
    
  });
});

// setTimeout(function(){
//   console.log("CODE:", web3.eth.getCode(contractAddress));

//   process.exit();
// },10000);



function usage(){
  console.log("Usage:" + "$deploy_contract.js <path-to-contract>");
}
