import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import { ReactElement } from "react";
import { makeStyles } from "@material-ui/core";
import { useForm } from "react-hook-form";

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
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
  },
  field: {
    marginBottom: 10,
    MuiInput: {
      root: {
        width: "100%",
        position: "relative",
      },
    },
  },
});

interface MintTokenInformation {
  modelId: string;
  name: string;
  size: number;
}

export function MintToken(): ReactElement {
  const { register, errors, handleSubmit } = useForm();
  const onSubmit = (data: MintTokenInformation) => console.log(data);
  const classes = useStyles();

  return (
    <div>
      <Container>
        <Grid>
          <Typography variant="h1" className={classes.header}>
            Mint new Sneaker Token
          </Typography>
          <form
            className={classes.formControl}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              label="Model Identifier"
              error={errors.modelId}
              helperText={errors.modelId && "Model Identifier is required"}
              name="modelId"
              inputRef={register({ required: true })}
              type="text"
              className={classes.field}
            />
            <TextField
              label="Model name"
              error={errors.name}
              helperText={
                (errors.name &&
                  (errors.name.type === "required"
                    ? "Name is required"
                    : "Name can have only up to 50 characters")) ||
                ""
              }
              name="name"
              inputRef={register({
                required: true,
                minLength: 5,
                maxLength: 50,
              })}
              type="text"
              className={classes.field}
            />
            <TextField
              label="Size"
              error={errors.size}
              helperText={errors.size && "Size have to be in range (1, 60)"}
              name="size"
              inputRef={register({ required: true, min: 1, max: 60 })}
              type="number"
              className={classes.field}
            />
            <div className="text-center mt-4">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </form>
        </Grid>
      </Container>
    </div>
  );
}
