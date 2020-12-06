import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";

import { Button, Container, Grid, TextField } from "@material-ui/core";
import { ContractContext, web3 } from "../../Contract";
import React, { ReactElement, useContext, useEffect, useState } from "react";

import FakeSneaker from "./FakeSneaker";
import Gauge from "./Gauge";
import OriginalSneaker from "./OriginalSneaker";
import { Sneaker } from "../../models/models";
import { makeStyles } from "@material-ui/core";

// This component should be responsible for loading wallets from MetaMask
export function Home(): ReactElement {
  const contract = useContext(ContractContext);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("ETH");
  const [amount, setAmount] = useState(30);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  const [checkSneaker, setCheckSneaker] = useState<string | null>(null);
  const [tokenValue, setTokenValue] = useState("");
  const sneaker: Sneaker = {
    token: "random token",
    modelId: "random model id",
    manufacturer: "random address",
    size: 10,
    name: "Random sneaker name",
  };

  useEffect(() => {
    const fetchWallet = async () => {
      console.log("account");
      try {
        const {
          result: [account],
        } = await window.ethereum.send("eth_requestAccounts");
        setAccount(account);
        setAmount(parseInt(await web3.eth.getBalance(account)));
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
      fontSize: 30,
    },
  }));
  const classes = useStyles();

  return (
    <div>
      <Container>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <div className={classes.header}>Wallet Balance</div>
            <div>
              <Gauge
                amount={amount}
                angle={`rotate(${(amount * 180) / max}deg)`}
                currency={currency}
                min={min}
                max={max}
              />
            </div>
          </Grid>
          <Grid item md={6}>
            {checkSneaker ? (
              checkSneaker === "random" ? (
                <OriginalSneaker
                  sneaker={sneaker}
                  onNext={() => setCheckSneaker(null)}
                />
              ) : (
                <FakeSneaker
                  token={checkSneaker}
                  onNext={() => setCheckSneaker(null)}
                />
              )
            ) : (
              <form>
                <p className="h4 text-center mb-4">Check sneaker</p>
                <label htmlFor="tokenIdLabel" className="grey-text">
                  Token id
                </label>
                <input
                  type="text"
                  id="tokenId"
                  className="form-control"
                  onChange={(e) => setTokenValue(e.target.value)}
                />
                <br />
                <div className="text-center mt-4">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setCheckSneaker(tokenValue);
                    }}
                    type="submit"
                    color="primary"
                    variant="outlined"
                  >
                    Check
                  </Button>
                </div>
              </form>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
