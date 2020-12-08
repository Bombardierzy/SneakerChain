import { ReactElement } from "react";
import { makeStyles } from "@material-ui/core";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";
import { Manufacturer } from "../../models/models";

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

interface ManufacturersTableProps {
  children: (manufacturer: Manufacturer) => any;
  manufacturers: Manufacturer[];
  title: string;
}

export function ManufacturersTable({
  children,
  manufacturers,
  title,
}: ManufacturersTableProps): ReactElement {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h1" className={classes.header}>
        {title}
      </Typography>
      <TableContainer className={classes.table}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Street</TableCell>
              <TableCell align="center">City</TableCell>
              <TableCell align="center">Postal Code</TableCell>
              <TableCell align="center">State</TableCell>
              <TableCell align="center">Country</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manufacturers.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.street}</TableCell>
                <TableCell align="center">{row.city}</TableCell>
                <TableCell align="center">{row.postalCode}</TableCell>
                <TableCell align="center">{row.state}</TableCell>
                <TableCell align="center">{row.country}</TableCell>
                <TableCell align="center">{children(row)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
