import { ReactElement, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Button, Typography } from '@material-ui/core';
import {Manufacturer}  from '../../models/models'

export function OurManufacturers(): ReactElement {
  const [manufacturers, setManufacturers ]= useState([
    {
      name: "Balenciaga",
      street: "Aleja jana marcina 35",
      city: "Pacanów",
      postalCode: "23-356",
      state: "lubelski",
      country: "Hiszpania"
    },
    {
      name: "Essa Buty",
      street: "Bylegdzie 3",
      city: "Wytrzyszczka",
      postalCode: "23-231",
      state: "malopolska",
      country: "Polska"
    }
  ]);

  const useStyles = makeStyles((theme) => ({
    table: {
        width: "100%",
    },
    header: {
        display: "flex",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 20,
        fontSize: 25
    },
  }));

  const deleteManufacturer = (row: Manufacturer) => {
    console.log(row);
    setManufacturers(manufacturers.filter( manufacturer => manufacturer !== row))
  }

  const classes = useStyles();

  return (
    <div>
    <Typography variant="h1" className={classes.header}>
        Our Manufacturers
    </Typography>
          <TableContainer className={classes.table} >
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
                <TableCell align="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ () => deleteManufacturer(row)}
                  >
                    Delete Manufacturer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
            </Table>
          </TableContainer>
    </div>
  );
}
