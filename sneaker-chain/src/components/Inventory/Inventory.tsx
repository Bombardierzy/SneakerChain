import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
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

import { Sneaker } from "../../models/models";
import { useAccount } from "../../hooks/useAccount";

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
});

export function Inventory(): ReactElement {
  const classes = useStyles();
  const [activeSneaker, setActiveSneaker] = useState<Sneaker | null>(null);

  const onCancel = () => setActiveSneaker(null);
  const onTransfer = () => {
    setActiveSneaker(null);
  };

  const account = useAccount();

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
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
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.modelID}</TableCell>
                <TableCell align="center">{row.manufacturer}</TableCell>
                <TableCell align="center">{row.size}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setActiveSneaker(row);
                    }}
                  >
                    Transfer ownership
                  </Button>
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
          Transfer token {activeSneaker?.token}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Please specify destination address to which you are willing to
            transfer selected sneaker. Remember that once sent you can't get
            your sneaker back unless the new owner sends it back. Make sure that
            you use correct address or you will lose your token forever!
            {activeSneaker?.name} - {activeSneaker?.modelID}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            required
            label="Destination address"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="default">
            Cancel
          </Button>
          <Button onClick={onTransfer} color="secondary">
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
