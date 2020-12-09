import { ReactElement, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";

interface PendingManufacturersProps {
  onAccept: () => void;
  onCancel: () => void;
  open: boolean;
}

export function ManufacturerDialog({
  onAccept,
  onCancel,
  open,
}: PendingManufacturersProps): ReactElement {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="alert-dialog-title">
        {"Are you sure to continue this operation?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Remember! Every single operation that takes part in Ethereum, be it a
          transaction or smart contract execution requires some amount of gas.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAccept} color="primary">
          Agree
        </Button>
        <Button onClick={onCancel} color="primary">
          Disagree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
