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

export function RequestManufacturerROle(): ReactElement {
  const { register, errors, handleSubmit } = useForm();

  const onSubmit = (data: Manufacturer) => console.log(data);
  const classes = useStyles();

  return (
    <div>
      <Container>
        <Grid>
          <Typography variant="h1" className={classes.header}>
            Would you like to be one of our Manufactures complete the form below
            and send request.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              helperText={errors.name && "Name is required"}
              error={errors.name}
              name="name"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />
            <TextField
              label="Street"
              error={errors.street}
              helperText={errors.street && "Street is required"}
              name="street"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />
            <TextField
              label="City"
              error={errors.city}
              helperText={errors.city && "City is required"}
              name="city"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />

            <TextField
              label="Postal Code"
              error={errors.postalCode}
              helperText={checkPostalCodeFormat(errors.postalCode)}
              name="postalCode"
              inputRef={register({
                required: true,
                pattern: /^[0-9]{2}-[0-9]{3}?$/i,
              })}
              type="text"
              className={classes.formControl}
            />
            <TextField
              label="State"
              error={errors.state}
              helperText={errors.state && "State is required"}
              name="state"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />
            <TextField
              label="Country"
              error={errors.country}
              helperText={errors.country && "Country is required"}
              name="country"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />

            <div className="text-center mt-4">
              <Button type="submit" color="primary" variant="contained">
                Send request
              </Button>
            </div>
          </form>
        </Grid>
      </Container>
    </div>
  );
}
