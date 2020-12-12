import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  makeStyles,
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";

import { Alert } from "@material-ui/lab";
import { Sneaker } from "../../models/models";
import { useAccount } from "../../hooks/useAccount";
import { useAppContext } from "../../contexts/appContext";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
});

export function Inventory(): ReactElement {
  const [{ contract, from }, dispatch] = useAppContext();
  const classes = useStyles();
  const [activeSneaker, setActiveSneaker] = useState<Sneaker | null>(null);

  const [transferringSneaker, setTransferringSneaker] = useState<Sneaker | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, errors, handleSubmit } = useForm();

  const onCancel = () => setActiveSneaker(null);
  const onTransfer = ({ address }: { address: string }) => {
    if (activeSneaker) {
      transferToken(activeSneaker, address);
    }
    setActiveSneaker(null);
  };

  const transferToken = async (sneaker: Sneaker, to: string) => {
    if (contract && from) {
      try {
        setTransferringSneaker(sneaker);
        await contract.methods
          .transferFrom(from, to, sneaker.token)
          .send({ from, gas: 200000 });
        setTransferringSneaker(null);
        dispatch({ type: "REMOVE_SNEAKER", sneaker: sneaker });
        setSuccess(true);
      } catch (error) {
        setError(
          "Failed to transfer token ownership, make sure you have enough ether!"
        );
        console.log(error);
      }
    }
  };

  const account = useAccount();

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Model Identifier</TableCell>
              <TableCell align="center">Manufacture address</TableCell>
              <TableCell align="center">Size</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(account?.sneakers || []).map((row) => (
              <TableRow key={row.token}>
                <TableCell align="center">{row.token}</TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.modelId}</TableCell>
                <TableCell align="center">{row.manufacturer}</TableCell>
                <TableCell align="center">{row.size}</TableCell>
                <TableCell align="center">
                  {transferringSneaker?.modelId === row.modelId ? (
                    <CircularProgress size={40} />
                  ) : (
                    <Button
                      variant="contained"
                      disabled={!!transferringSneaker}
                      color="primary"
                      onClick={() => {
                        setActiveSneaker(row);
                        console.log(row);

                      }}
                    >
                      Transfer ownership
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={activeSneaker !== null}
        onClose={onCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Transfer token: <b>{activeSneaker?.token}</b>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Please specify destination address to which you are willing to
            transfer selected sneaker. Remember that once sent you can't get
            your sneaker back unless the new owner sends it back. Make sure that
            you use correct address or you will lose your token forever!
            <br />
            Name: {activeSneaker?.name} - Model ID: {activeSneaker?.modelId}
          </DialogContentText>
          <form>
            <TextField
              autoFocus
              margin="dense"
              id="address"
              required
              label="Destination address"
              name="address"
              helperText={
                errors.address &&
                (errors.address.type === "pattern"
                  ? "Invalid address format"
                  : "Address is required")
              }
              error={errors.address}
              inputRef={register({
                required: true,
                pattern: /^[a-z0-9]{42}$/i,
              })}
              type="text"
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="default">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onTransfer)} color="secondary">
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={error !== null}
        onClose={() => setError(null)}
        autoHideDuration={5000}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar
        open={success}
        onClose={() => setSuccess(false)}
        autoHideDuration={5000}
      >
        <Alert severity="success">
          Token's ownership has been transferred to given address!
        </Alert>
      </Snackbar>
      <Snackbar open={!!transferringSneaker}>
        <Alert severity="info">Waiting for a token to be transferred.</Alert>
      </Snackbar>
    </>
  );
}
