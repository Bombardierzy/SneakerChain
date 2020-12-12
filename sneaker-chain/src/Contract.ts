import { CryptoSneaker } from "./contracts/CryptoSneaker";
import Web3 from "web3";
import { cryptoSneakerAbi } from "./abis/abis";

export const web3 = new Web3(
  window.ethereum
);

export function loadCryptoSneakerContract(address: string): CryptoSneaker {
  return (new web3.eth.Contract(
    cryptoSneakerAbi,
    address
  ) as any) as CryptoSneaker;
}
