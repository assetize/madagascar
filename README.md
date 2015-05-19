# Madagascar

[![npm version](https://badge.fury.io/js/mdg.svg)](http://badge.fury.io/js/mdg)

# General purpose Ethereum smart contract API server

## installation

```
npm install mdg
```

## usage

```js
var Mdg = require("mdg");

var mdg = (new Mdg(settings)).start();
```

## settings

* webserver
** port: port number to start the web server on
* eth
** rpcport: the port to connect to an ethereum client JSON-RPC on
* contract
** address: address of the deployed contract to link to
** abi: ABI interface of the contract (see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI)
