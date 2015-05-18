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
  data: compiled.code
}, function(err, addr){
  if(err) throw err;
  console.log("Address:", addr);

  console.log("pending txs",web3.eth.getBlock("pending", true).transactions);

  console.log("contract:", web3.eth.getCode(addr));

  console.log("block", web3.eth.getBlock("pending", true));

  process.exit();
});

// setTimeout(function(){
//   console.log("CODE:", web3.eth.getCode(contractAddress));

//   process.exit();
// },10000);



function usage(){
  console.log("Usage:" + "$deploy_contract.js <path-to-contract>");
}
