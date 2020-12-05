import { ReactElement, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Container, Grid, Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';

interface IFormInput {
  name: String;
  modelId: String;
  size: number;
}

export function Manufacturer(): ReactElement {

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

  const classes = useStyles();
  const onSubmit = (data: IFormInput) => console.log(data);

  return (
    <div>
     <Container>
        <Grid>
          <h1 className={classes.header}>
            Add new Shoes
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="nameLabel" className="ml-2">
                Name
              </label>
              <input name="name" ref={register({required: true})} type="text" id="streetId" className="form-control mb-2"/>

              <label htmlFor="modelId" className="ml-2">
                Model ID
              </label>
              <input name="modelId" ref={register} type="text" className="form-control mb-2"/>

              <label htmlFor="sizeLabel" className="ml-2">
                Size
              </label>
              <input name="size" ref={register} type="text" id="streetId" className="form-control mb-2"/>

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
