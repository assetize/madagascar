# Madagascar (mdg)

[![npm version](https://badge.fury.io/js/mdg.svg)](http://badge.fury.io/js/mdg)


# General purpose Ethereum smart contract API server

The library is designed to make it easier to programmatically interact with smart contracts on [Ethereum](https://ethereum.org). It achieves that by creating a RESTful JSON api that mirrors all functions of a given contract. As a result, calls to contract functions can be made remotely via a traditional HTTP endpoint interface.

It also features a fully functional integration test suite that allows for automated testing of smart contract functions. 

To see how this works please check the [SimpleCoin API test](https://github.com/assetize/madagascar/blob/master/test/simple_coin_api.js)

## Installation

```
npm install mdg
```

## Dependencies

The library requires a running instance of an Ethereum client with JSON-RPC enabled. See:
* [https://github.com/ethereum/go-ethereum](https://github.com/ethereum/go-ethereum)
* [https://github.com/ethereum/cpp-ethereum](https://github.com/ethereum/cpp-ethereum)

Make sure your primary account (or coinbase) has some funds, or otherwise you will not be able to send any transactions. Apart from this, your primary account needs to be explicitly "unlocked" to allow for transactions being sent via a programmatic interface ([web3](https://github.com/ethereum/web3.js)). For example, with Geth you need to start your client with `--unlock primary`. The full command would look like:

```
geth --unlock primary --rpc
```

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
  * abi: ABI interface of the contract (see [https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI))

## A note on running tests

If you configured your Ethereum client to work as described in the Dependencies section then testing should be pretty straight forward. A word of advice would be to set up your Ethereum client to run a private chain so you have plenty of ether to spend. I would also recommend reducing the amount of hardware resources allocated to mining so that your machine makes a bit less noise :) With Geth the full command would look like this (replace "12345" with any number):

```
geth --networkid 12345 --minerthreads 1  --rpc --unlock primary --mine
```

