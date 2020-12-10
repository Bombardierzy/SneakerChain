import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from "@material-ui/core";

import { ReactElement } from "react";

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

interface VerifiedManufacturersProps {
  manufacturers: string[];
}

export function VerifiedManufacturers({
  manufacturers,
}: VerifiedManufacturersProps): ReactElement {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h1" className={classes.header}>
        Verified manufacturers
      </Typography>
      <TableContainer className={classes.table}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manufacturers.map((address) => (
              <TableRow key={address}>
                <TableCell align="center">{address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
