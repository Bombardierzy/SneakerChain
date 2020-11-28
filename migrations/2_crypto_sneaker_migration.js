const  CryptoSneaker = artifacts.require("./CryptoSneaker.sol");
module.exports = async function(deployer) {
  await deployer.deploy(CryptoSneaker);
  const cryptoSneaker = await CryptoSneaker.deployed();
};