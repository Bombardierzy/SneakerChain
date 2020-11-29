/// <reference types="react-scripts" />
import Web3 from "web3";

declare namespace ENVS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    CRYPTO_SNEAKER_CONTRACT_ADDRESS: string;
  }
}
declare global {
  interface Window {
    Stripe: any;
    ethereum: any;
  }
}
