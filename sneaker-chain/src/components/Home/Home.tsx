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

interface SneakerCheckResult {
  valid: boolean;
  sneaker?: Sneaker & { owner: string };
}

// This component should be responsible for loading wallets from MetaMask
export function Home(): ReactElement {
  const [{ contract, from }, dispatch] = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const { register, errors, handleSubmit } = useForm();

  const [sneakerCheck, setSneakerCheck] = useState<SneakerCheckResult | null>(
    null
  );
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        await window.ethereum.send("eth_requestAccounts");
        const account: string = window.ethereum.selectedAddress;

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

  const onSubmit = ({ token }: { token: string }) => {
    checkToken(token);
  };

  const checkToken = async (token: string) => {
    if (contract) {
      try {
        const {
          name,
          size,
          manufacturer,
          modelId,
        } = await contract.methods.sneakers(token).call();
        // if sneaker does not exist it default to zero in all fields
        if (manufacturer === "0x0000000000000000000000000000000000000000") {
          setSneakerCheck({ valid: false });
        } else {
          const owner = await contract.methods.ownerOf(token).call();
          setSneakerCheck({
            valid: true,
            sneaker: { token, name, size, manufacturer, modelId, owner },
          });
        }
      } catch (error) {
        // TODO: it might come from other error than invalid token format
        setSneakerCheck({ valid: false });
        console.log(error);
      }
    }
  };

  const classes = useStyles();

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item md={6} className={classes.content}>
            {from && balance !== null ? (
              <WalletBalancePig amount={balance} />
            ) : (
              <></>
            )}
          </Grid>
          <Grid item md={6}>
            {sneakerCheck ? (
              sneakerCheck.valid ? (
                <OriginalSneaker
                  sneaker={sneakerCheck.sneaker!!}
                  onNext={() => setSneakerCheck(null)}
                />
              ) : (
                <FakeSneaker
                  token={token}
                  onNext={() => setSneakerCheck(null)}
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
