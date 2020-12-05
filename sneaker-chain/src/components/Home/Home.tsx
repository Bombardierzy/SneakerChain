import React, { ReactElement, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Gauge from "./Gauge";
import { web3,  ContractContext } from "../../Contract"
import { Container, Grid, Button } from '@material-ui/core';
import 'mdbreact/dist/css/mdb.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';

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
      fontSize: 30
    }
  }));
  const classes = useStyles();


  return (
    <div>
      <Container>
        <Grid container spacing={2}>
          <Grid item md={6}>
          <div className={classes.header}>
            Wallet Balance
          </div>
          <div>
            <Gauge
            amount={amount}
            angle={`rotate(${(amount * 180) / max}deg)`}
            currency={currency}
            min={min}
            max={max}/>
          </div>
          </Grid>
          <Grid item md={6}>
            <form>
              <p className="h4 text-center mb-4">Check sneaker</p>
              <label htmlFor="tokenIdLabel" className="grey-text">
                Token id
              </label>
              <input type="text" id="tokenId" className="form-control" />
              <br />
              <div className="text-center mt-4">
                <Button type="submit" color="primary" variant="outlined">
                  Check
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
