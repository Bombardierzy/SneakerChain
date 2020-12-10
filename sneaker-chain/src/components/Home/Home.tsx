import "bootstrap-css-only/css/bootstrap.min.css";

import {
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";

import { Alert } from "@material-ui/lab";
import FakeSneaker from "./FakeSneaker";
import OriginalSneaker from "./OriginalSneaker";
import { Sneaker } from "../../models/models";
import { WalletBalancePig } from "./WalletBalancePig";
import { makeStyles } from "@material-ui/core";
import { useAppContext } from "../../contexts/appContext";
import { useForm } from "react-hook-form";
import { web3 } from "../../Contract";

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    fontSize: 30,
  },
  content: {
    textAlign: "center",
    display: "block",
  },
  piggy: {
    width: 150,
    height: 150,
  },
  button: {
    marginTop: 20,
  },
  textField: {
    width: "100%",
  },
});

// This component should be responsible for loading wallets from MetaMask
export function Home(): ReactElement {
  const [{ from }, dispatch] = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const { register, errors, handleSubmit } = useForm();

  const [checkSneaker, setCheckSneaker] = useState<string | null>(null);
  const [token, setToken] = useState("");

  const sneaker: Sneaker = {
    token: "random token",
    modelId: "random model id",
    manufacturer: "random address",
    size: 10,
    name: "Random sneaker name",
  };

  useEffect(() => {
    if (from) return;
    const fetchWallet = async () => {
      try {
        const {
          result: [account],
        } = await window.ethereum.send("eth_requestAccounts");

        dispatch({ type: "SET_FROM", from: account });
      } catch (error) {
        console.log(error);
        setError(
          "Error happened while fetching wallet! Make sure you have enabled MetaMask!"
        );
      }
    };
    fetchWallet();
  }, [dispatch, from]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (from) {
        const balance = parseFloat(
          web3.utils.fromWei(await web3.eth.getBalance(from), "ether")
        );
        setBalance(balance);
      }
    };
    fetchBalance();
  }, [from, setBalance]);

  const onSubmit = (data: { token: string }) => {
    setCheckSneaker(data.token);
  };

  const classes = useStyles();

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item md={6} className={classes.content}>
            {from && balance ? <WalletBalancePig amount={balance} /> : <></>}
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Typography variant="h1" className={classes.header}>
                    Check sneaker
                  </Typography>
                  <TextField
                    label="Token"
                    helperText={(errors?.token && "Token is required") || ""}
                    type="text"
                    name="token"
                    className={classes.textField}
                    onChange={(e) => setToken(e.target.value)}
                    error={errors.token}
                    inputRef={register({ required: true })}
                  />
                  <div className={classes.content}>
                    <Button
                      className={classes.button}
                      type="submit"
                      color="primary"
                      variant="outlined"
                    >
                      Check
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Grid>
        </Grid>
      </Container>
      <Snackbar open={error !== null} autoHideDuration={5000}>
        <Alert severity="error">{error || ""}</Alert>
      </Snackbar>
    </>
  );
}
