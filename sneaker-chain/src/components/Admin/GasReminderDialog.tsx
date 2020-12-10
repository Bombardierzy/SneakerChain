import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import { ReactElement } from "react";

interface GasReminderDialogProps {
  onAccept: () => void;
  onCancel: () => void;
  open: boolean;
}

export function GasReminderDialog({
  onAccept,
  onCancel,
  open,
}: GasReminderDialogProps): ReactElement {
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
        <Button onClick={onCancel} color="default">
          Cancel
        </Button>
        <Button onClick={onAccept} color="primary">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
