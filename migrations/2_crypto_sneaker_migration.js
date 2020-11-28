const  CryptoSneaker = artifacts.require("./CryptoSneaker.sol");
module.exports = async function(deployer) {
  await deployer.deploy(CryptoSneaker, "CryptoSneaker Token", "CryptoSneaker");
  const cryptoSneaker = await CryptoSneaker.deployed();
};