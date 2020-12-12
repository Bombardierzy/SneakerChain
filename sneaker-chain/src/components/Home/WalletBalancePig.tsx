import React, { ReactElement } from "react";

import CountUp from "react-countup";
import { Typography } from "@material-ui/core";
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
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});

// This component should be responsible for loading wallets from MetaMask
export function WalletBalancePig(props: { amount: number }): ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h1" className={classes.header}>
        Wallet Balance
      </Typography>
      <img alt="Piggy" src="https://image.freepik.com/free-vector/money-box-form-pig_97231-276.jpg" className={classes.piggy} />
      <CountUp
        start={0}
        decimals={8}
        end={props.amount}
        decimal="."
        duration={4}
        prefix="ETH "
      />
    </div>
  );
}
