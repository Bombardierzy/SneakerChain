import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";

import {
  Button,
  Container,
  Grid,
  Typography,
  FormLabel,
  TextField,
} from "@material-ui/core";
import { ContractContext, web3 } from "../../Contract";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import FakeSneaker from "./FakeSneaker";
import OriginalSneaker from "./OriginalSneaker";
import { Sneaker } from "../../models/models";
import { makeStyles } from "@material-ui/core";
import { WalletBalancePig } from "./WalletBalancePig";
import { useForm } from "react-hook-form";

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
  const contract = useContext(ContractContext);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(30);
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
    const fetchWallet = async () => {
      try {
        const {
          result: [account],
        } = await window.ethereum.send("eth_requestAccounts");
        console.log(account);
        setAccount(account);
        setAmount(parseInt(await web3.eth.getBalance(account)));
      } catch (error) {
        setError("Error happened while fetching wallet!");
      }
    };

    fetchWallet();
  }, []);

  const onSubmit = (data: { token: string }) => {
    console.log(data);
    setCheckSneaker(data.token);
  };

  const classes = useStyles();

  return (
    <div>
      <Container>
        <Grid container spacing={2}>
          <Grid item md={6} className={classes.content}>
            <WalletBalancePig amount={amount} />
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
                    label={!errors.token ? "Token" : "Token is required"}
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
    </div>
  );
}
