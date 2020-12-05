import { ReactElement, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Container, Grid, Button, TextField, FormLabel } from '@material-ui/core';
import { useForm } from 'react-hook-form';

interface IFormInput {
  street: String;
  city: String;
  postalCode: String;
  state: String;
  country: String;
}

export function Admin(): ReactElement {
  const [address, setAddress] = useState(0);

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

  const onSubmit = (data: IFormInput) => console.log(data);
  const classes = useStyles();

  return (
    <div>
      <Container>
        <Grid>
          <h1 className={classes.header}>
            Add new Manufacturer
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
              <FormLabel hidden={errors.street} htmlFor="streetLabel" className="ml-2">
                Street
              </FormLabel>
              <FormLabel hidden={!errors.street} htmlFor="streetLabel" className="text-danger ml-2">
                Street is required
              </FormLabel>
              <TextField error={errors.street} name="street" inputRef={register({required: true})} type="text" id="streetId" className="form-control mb-2"/>

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
              <TextField error={errors.postalCode} name="postalCode" inputRef={register({required: true, pattern: /^[0-9]{2}-[0-9]{3}?$/i})} type="text" id="streetId" className="form-control mb-2"/>

              <FormLabel hidden={errors.state} htmlFor="stateLabel" className="ml-2">
                State
              </FormLabel>
              <FormLabel hidden={!errors.state} htmlFor="stateLabel" className="text-danger ml-2">
                State is required
              </FormLabel>
              <TextField error={errors.state} name="state" inputRef={register({required: true})}  type="text" id="streetId" className="form-control mb-2"/>

              <FormLabel hidden={errors.country} htmlFor="countryLabel" className="ml-2">
                Country
              </FormLabel>
              <FormLabel hidden={!errors.country} htmlFor="countryLabel" className="text-danger ml-2">
                Country is required
              </FormLabel>
              <TextField error={errors.country} name="country" inputRef={register({required: true})} type="text" id="streetId" className="form-control mb-2"/>

            <div className="text-center mt-4">
              <Button type="submit" color="primary" variant="outlined">
                Submit
              </Button>
            </div>
          </form>

        </Grid>
      </Container>
    </div>
  );
}
