import React from "react";
import Web3 from "web3";
import { cryptoSneakerAbi } from "./abis/abis";

const CRYPTO_SNEAKER_CONTRACT_ADDRESS =
  "0xa36e2a7b0b1cdd13213d661fb755a5ca5e6e99d0";

export const web3 = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545")
);

export function loadCryptoSneakerContract() {
  return new web3.eth.Contract(
    cryptoSneakerAbi,
    CRYPTO_SNEAKER_CONTRACT_ADDRESS
  );
}

export const ContractContext = React.createContext(loadCryptoSneakerContract());
