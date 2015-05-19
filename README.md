# Madagascar (mdg)

[![npm version](https://badge.fury.io/js/mdg.svg)](http://badge.fury.io/js/mdg)


# General purpose Ethereum smart contract API server

The library is aimed at making it easier to programmatically interact with Ethereum smart contracts. It achieves that by creating a RESTful JSON api that reflects all functions of a given contract. As a result calls to contract functions can be made remotely via a traditional HTTP endpoint interface.

To see how this works please check the [SimpleCoin API test](https://github.com/assetize/madagascar/blob/master/test/simple_coin_api.js)

## Installation

```
npm install mdg
```

## Dependencies

The library requires a running instance of an Ethereum client with JSON-RPC enabled. See:
* https://github.com/ethereum/go-ethereum
* https://github.com/ethereum/cpp-ethereum

## Usage

```js
var Mdg = require("mdg");

var mdg = (new Mdg(settings)).start();
```

## Settings
A sample settings file can be found in `test/`

* webserver
  * port: port number to start the web server on
* eth
  * rpcport: the port to connect to an ethereum client JSON-RPC on
* contract
  * address: address of the deployed contract to link to
  * abi: ABI interface of the contract (see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI)
