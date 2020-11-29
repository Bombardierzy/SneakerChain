# Instruction how to run given contract example

## Requirements
First of all `nodejs`.
Then one needs to install `ganache-cli`, `geth` and `truffle` to be able to run this project.
```bash
npm install -g ganache-cli geth truffle
```

## Instruction
 * `npm install` - installs `@openzeppelin` contracts
 * in separate terminal `ganache-cli -m abcdef`, abcdef is just a random string
 * in another terminal `truffle migrate`
 * in the same termianl as was the migration `geth attach http://localhost:8545`
 

 ### Commands inside geth session
 
 Migration command should have generated `build/contracts` directory having json representation of contracts' abis.
 You need just to minify `abi` field, not the whole json file.

 You should prepare minified representation of `CryptoERC721.json` `abi` value.
 Then run in `geth` terminal following commands.

```js
var abi = // here should go minified json representation from build/contracts/CryptoSneaker.json
var deployed = eth.contract(abi).at("here goes contract address")
deployed.requestManufacturerRole({from: eth.accounts[0], gas: 5000000, value: 1})
deployed.approveManufacturer(eth.accounts[0], 1, {from: eth.accounts[0], gas: 500000})
deployed.mint(666, "Travis Scott - Yeezy", 43, {from: eth.accounts[0], gas: 500000})
deployed.sneakers(1)
```

From now you should be able to transfer ownership of created tokens and create new ones.
`geth` session offers you 10 accounts to choose from. Feel free to play around.

Inspect `contracts/CryptoSneaker.sol` and `contracts/CustomERC721.sol` for all available functions.

