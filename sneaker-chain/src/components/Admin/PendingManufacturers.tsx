import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ReactElement, useState } from "react";

import { GasReminderDialog } from "./GasReminderDialog";
import { PendingManufacturer } from "../../models/models";
import { web3 } from "../../Contract";

const useStyles = makeStyles({
  table: {
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 20,
    fontSize: 25,
  },
});

interface PendingManufacturersProps {
  manufacturers: PendingManufacturer[];
  onDeny: (manufacturer: PendingManufacturer) => void;
  onAccept: (manufacturer: PendingManufacturer) => void;
}

interface ActionDialog {
  accept: boolean;
  manufacturer: PendingManufacturer;
}

export function PendingManufacturers({
  manufacturers,
  onDeny,
  onAccept,
}: PendingManufacturersProps): ReactElement {
  const [actionDialog, setActionDialog] = useState<ActionDialog | null>(null);
  const classes = useStyles();

  return (
    <>
      <Typography variant="h1" className={classes.header}>
        Pending Manufacturers
      </Typography>
      <TableContainer className={classes.table}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Fee</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {manufacturers.map(({ address, amount }) => (
              <TableRow key={address}>
                <TableCell align="center">{address}</TableCell>
                <TableCell align="center">
                  {web3.utils.fromWei(amount, "ether")}
                </TableCell>
                <TableCell align="center">
                  <Button
                    className="mr-2"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setActionDialog({
                        accept: true,
                        manufacturer: { address, amount },
                      })
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    className="ml-2"
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      setActionDialog({
                        accept: false,
                        manufacturer: { address, amount },
                      })
                    }
                  >
                    Deny
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <GasReminderDialog
        open={!!actionDialog}
        onAccept={() => {
          if (actionDialog) {
            const { manufacturer, accept } = actionDialog;
            if (accept) {
              onAccept(manufacturer);
            } else {
              onDeny(manufacturer);
            }
          }
          setActionDialog(null);
        }}
        onCancel={() => {
          setActionDialog(null);
        }}
      />
    </>
  );
}
