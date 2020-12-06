import { ReactElement } from "react";
import { makeStyles } from "@material-ui/core";
import { Container, Grid, Button, TextField, FormLabel, Typography } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {Manufacturer}  from '../../models/models'

export function NewManufacturer(): ReactElement {
  const {register, errors, handleSubmit} = useForm();

  const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 20,
      fontSize: 25
    },

    formControl: {
      width: '100%',
      marginTop: 10
    }

  }));

  const onSubmit = (data: Manufacturer) => console.log(data);
  const classes = useStyles();

  return (
    <div>
      <Container>
        <Grid>
          <Typography variant="h1" className={classes.header}>
            Would you like to be one of our Manufactures complete the form below and send request.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
              <FormLabel hidden={errors.name} htmlFor="nameLabel" className="ml-2">
                Name
              </FormLabel>
              <FormLabel hidden={!errors.name} htmlFor="nameLabel" className="text-danger ml-2">
                Name is required
              </FormLabel>
              <TextField error={errors.name} name="name" inputRef={register({required: true})} type="text" className="form-control mb-2"/>

              <FormLabel hidden={errors.street} htmlFor="streetLabel" className="ml-2">
                Street
              </FormLabel>
              <FormLabel hidden={!errors.street} htmlFor="streetLabel" className="text-danger ml-2">
                Street is required
              </FormLabel>
              <TextField error={errors.street} name="street" inputRef={register({required: true})} type="text" className="form-control mb-2"/>

              <FormLabel hidden={errors.city} htmlFor="cityLabel" className="ml-2">
                City
              </FormLabel>
              <FormLabel hidden={!errors.city} htmlFor="streetLabel"  className="text-danger ml-2">
                City is required
              </FormLabel>
              <TextField error={errors.city} name="city" inputRef={register({required: true})} type="text" className="form-control mb-2"/>

              <FormLabel hidden={errors.postalCode} htmlFor="postalCodeLabel" className="ml-2">
                Postal Code
              </FormLabel>
              <FormLabel hidden={!(errors.postalCode && errors.postalCode.type === "pattern")} htmlFor="streetLabel" className="text-danger ml-2">
                Invalid postal code format
              </FormLabel>
              <FormLabel hidden={!(errors.postalCode && errors.postalCode.type === "required")} htmlFor="postalCodeLabel" className="text-danger ml-2">
                Postal Code is required
              </FormLabel>
              <TextField error={errors.postalCode} name="postalCode" inputRef={register({required: true, pattern: /^[0-9]{2}-[0-9]{3}?$/i})} type="text" className="form-control mb-2"/>

              <FormLabel hidden={errors.state} htmlFor="stateLabel" className="ml-2">
                State
              </FormLabel>
              <FormLabel hidden={!errors.state} htmlFor="stateLabel" className="text-danger ml-2">
                State is required
              </FormLabel>
              <TextField error={errors.state} name="state" inputRef={register({required: true})}  type="text" className="form-control mb-2"/>

              <FormLabel hidden={errors.country} htmlFor="countryLabel" className="ml-2">
                Country
              </FormLabel>
              <FormLabel hidden={!errors.country} htmlFor="countryLabel" className="text-danger ml-2">
                Country is required
              </FormLabel>
              <TextField error={errors.country} name="country" inputRef={register({required: true})} type="text" className="form-control mb-2"/>

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
