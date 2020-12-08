import { ReactElement } from "react";
import { makeStyles } from "@material-ui/core";
import {
  Container,
  Grid,
  Button,
  TextField,
  Typography,
} from "@material-ui/core";
import { FieldError, useForm } from "react-hook-form";
import { Manufacturer } from "../../models/models";

const useStyles = makeStyles((theme) => ({
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
}));

const checkPostalCodeFormat = (error: FieldError): string => {
  if (!error) return "PostalCode";
  if (error.type === "pattern") return "Invalid postal code format";
  return "Postal Code is required";
};

export function NewManufacturer(): ReactElement {
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
              label={!errors.name ? "Name" : "Name is required"}
              error={errors.name}
              name="name"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />
            <TextField
              label={!errors.street ? "Street" : "Street is required"}
              error={errors.street}
              name="street"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />
            <TextField
              label={!errors.city ? "City" : "City is required"}
              error={errors.city}
              name="city"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />

            <TextField
              label={checkPostalCodeFormat(errors.postalCode)}
              error={errors.postalCode}
              name="postalCode"
              inputRef={register({
                required: true,
                pattern: /^[0-9]{2}-[0-9]{3}?$/i,
              })}
              type="text"
              className={classes.formControl}
            />
            <TextField
              label={!errors.state ? "State" : "State is required"}
              error={errors.state}
              name="state"
              inputRef={register({ required: true })}
              type="text"
              className={classes.formControl}
            />
            <TextField
              label={!errors.country ? "Country" : "Country is required"}
              error={errors.country}
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
