import { ReactElement, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Container, Grid, Button } from '@material-ui/core';
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

  const {register, handleSubmit} = useForm();

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
              <label htmlFor="streetLabel" className="ml-2">
                Street
              </label>
              <input name="street" ref={register({required: true})} type="text" id="streetId" className="form-control mb-2"/>

              <label htmlFor="cityLabel" className="ml-2">
                City
              </label>
              <input name="city" ref={register} type="text" className="form-control mb-2"/>

              <label htmlFor="postalCodeLabel" className="ml-2">
                Postal Code
              </label>
              <input name="postalCode" ref={register} type="text" id="streetId" className="form-control mb-2"/>

              <label htmlFor="stateLabel" className="ml-2">
                State
              </label>
              <input name="state" ref={register} type="text" id="streetId" className="form-control mb-2"/>

              <label htmlFor="countryLabel" className="ml-2">
                Country
              </label>
              <input name="country" ref={register} type="text" id="streetId" className="form-control mb-2"/>

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
