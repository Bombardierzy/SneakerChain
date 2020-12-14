import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { FieldError, useForm } from "react-hook-form";

import { Manufacturer } from "../../models/models";
import { ReactElement } from "react";
import { makeStyles } from "@material-ui/core";
import { useAppContext } from "../../contexts/appContext";
import { web3 } from "../../Contract";
import { useState } from "react";
import React from "react";
import { CircularProgress } from "@material-ui/core";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 25,
  },

  formControl: {
    width: "100%",
    marginTop: 10,
  },
});

const checkPostalCodeFormat = (error: FieldError): string => {
  if (!error) return "";
  if (error.type === "pattern") return "Invalid postal code format";
  return "Postal Code is required";
};

interface RequestManufacturerRoleProps {
  onSuccess: () => void;
}

export function RequestManufacturerRole({
  onSuccess,
}: RequestManufacturerRoleProps): ReactElement {
  const [{ contract, from }] = useAppContext();
  const { register, errors, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = ({ amount }: { amount: number }) => {
    requestManufacturerRole(amount);
  };
  const classes = useStyles();

  const requestManufacturerRole = async (amount: number) => {
    if (!contract || !from) return;
    try {
      setLoading(true);
      await contract.methods
        .requestManufacturerRole()
        .send({ from, value: amount, gas: 200000 });
      setLoading(false);
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Container>
        <Grid>
          <Typography variant="h1" align="center" className={classes.header}>
            Would you like to be one of our Manufactures? Then complete the form
            below with a fee amount and proceed. Amount is given in WEI unit.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Amount"
              helperText={errors.amount && "Amount is required"}
              error={errors.amount}
              type="number"
              name="amount"
              inputRef={register({ required: true })}
              className={classes.formControl}
            />

            <div className="text-center mt-4">
              {loading ? (
                <CircularProgress size={40} />
              ) : (
                <Button type="submit" color="primary" variant="contained">
                  Apply for manufacturer
                </Button>
              )}
            </div>
          </form>
        </Grid>
      </Container>
      <Snackbar open={loading}>
        <Alert severity="info">Waiting for processing your request!</Alert>
      </Snackbar>
    </div>
  );
}
