import { ReactElement } from "react";
import { makeStyles } from "@material-ui/core";
import { Container, Grid, Button, TextField, FormLabel, Typography } from '@material-ui/core';
import { useForm } from 'react-hook-form';

interface IFormInput {
    token: String;
}

export function AddToken(): ReactElement {
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
          <Typography variant="h1" className={classes.header}>
            Add new Sneaker
          </Typography>
          <form className={classes.formControl} onSubmit={handleSubmit(onSubmit)}>
              <FormLabel hidden={errors.token} htmlFor="tokenLabel" className="ml-2">
                Token
              </FormLabel>
              <FormLabel hidden={!errors.token} htmlFor="tokenLabel" className="text-danger ml-2">
                Token is required
              </FormLabel>
              <TextField error={errors.token} name="token" inputRef={register({required: true})} type="text" className="form-control mb-2"/>

            <div className="text-center mt-4">
              <Button type="submit" variant="contained" color="secondary">
                Submit
              </Button>
            </div>
          </form>

        </Grid>
      </Container>
    </div>
  );
}
