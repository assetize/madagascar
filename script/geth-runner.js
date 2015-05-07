#!/usr/bin/env node

var _ = require("lodash"),
    settings = require("../settings.json"),
    gethProc = require("child_process").spawn(settings.eth.gethPath,[
      "--rpc",
      "--networkid", settings.eth.networkid,
      "console"
    ]);


var commands = _.reduce({
  mineStart: "admin.miner.start(1)",
  mineStop: "admin.miner.stop()",
  startRPC: "admin.startRPC('http://locahost', "+settings.eth.rpcport+", '*')"
}, function(memo, val, key){
  memo[key] = function(){ gethProc.stdin.write(val + "\n"); };
  
  return memo;
}, {});

gethProc.stdout.on("data", function(data){
  console.log(data.toString());
});

gethProc.stderr.on("data", function(data){
  console.log("ERR:", data.toString());
});

gethProc.on('close', function (code) {
  console.log('child process exited with code ' + code);
});



var server = require("net").createServer(function(c){
  console.log("client connected");
  
  c.on("end", function(){
    console.log("client disconnected");
  });

  c.on("data", function(data){
    var key = data.toString();

    if(commands[key]){
      commands[key]();
    }else{
      console.error("Unknown command:", key);
    }
  });
});

server.listen("/tmp/gethrunner.sock", function(){
  console.log("server bound");
});

process.on("SIGINT", function(){
  console.log("shutting down server");
  server.close();
});
