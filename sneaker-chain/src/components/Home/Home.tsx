import React, { ReactElement, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Gauge from "./Gauge";
import { web3 } from "../../Contract"

import { ContractContext } from "../../Contract";

// This component should be responsible for loading wallets from MetaMask
export function Home(): ReactElement {
  const contract = useContext(ContractContext);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("ETH");
  const [amount, setAmount] = useState(30);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

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
        setAmount(parseInt( await web3.eth.getBalance(account)))
      } catch (error) {
        setError("Error happened while fetching wallet!");
      }
    };

    fetchWallet();
  }, []);

  const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      justifyContent: "center",
      marginTop: 10,
      fontSize: 40
    }
  }));
  const classes = useStyles();


  return (
    <div>
      <header className={classes.header}>
        Wallet Balance
      </header>
      <div>
        <Gauge
        amount={amount}
        angle={`rotate(${(amount * 180) / max}deg)`}
        currency={currency}
        min={min}
        max={max}/>
      </div>
      
    </div>
  );
}
