import { Typography } from "@material-ui/core";
import React, { ReactElement } from "react";
import CountUp from "react-countup";
import { makeStyles } from "@material-ui/core";

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
});

// This component should be responsible for loading wallets from MetaMask
export function WalletBalancePig(props: { amount: number }): ReactElement {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h1" className={classes.header}>
        Wallet Balance
      </Typography>
      <img alt="Piggy" src="./piggy.png" className={classes.piggy} />
      <br />
      <CountUp
        start={0}
        decimals={2}
        end={props.amount}
        decimal="."
        duration={4}
        prefix="ETH "
      />
    </>
  );
}
