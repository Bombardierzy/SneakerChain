import React, { ReactElement, useContext, useEffect, useState } from "react";

import { ContractContext } from "../../Contract";

// This component should be responsible for loading wallets from MetaMask
export function Home(): ReactElement {
  const contract = useContext(ContractContext);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // const loadWallet = async () => {
  //   const {result: accounts} = await window.ethereum.send("eth_requestAccounts");
  //   console.log("Your wallet address", accounts[0]);
  //   contract.methods.requestManufacturerRole().send({from: accounts[0], gas: 500000, value: 1});
  // }

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const {
          result: [account],
        } = await window.ethereum.send("eth_requestAccounts");
        setAccount(account);
      } catch (error) {
        setError("Error happened while fetching wallet!");
      }
    };

    fetchWallet();
  }, []);

  return (
    <div>
      <div>HOME</div>
      {account !== null ? <span>Your wallet address: {account}</span> : null}
      {account === null && error !== null ? <span>{error}</span> : null}
      {account === null && error == null ? (
        <span>Loading wallet...</span>
      ) : null}
    </div>
  );
}
