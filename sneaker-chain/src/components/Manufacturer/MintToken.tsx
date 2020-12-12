import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { ReactElement, useState } from "react";

import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";
import { useAppContext } from "../../contexts/appContext";
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
  const [{ contract, from }, dispatch] = useAppContext();
  const { register, errors, reset, handleSubmit } = useForm();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = (data: MintTokenInformation) => {
    mintToken(data);
  };
  const classes = useStyles();

  const mintToken = async ({ modelId, name, size }: MintTokenInformation) => {
    if (contract && from) {
      try {
        setLoading(true);
        const result = await contract.methods
          .mint(modelId, name, size.toString())
          .send({ from, gas: 1000000 });
        setLoading(false);
        // const result = await contract.methods.mint(modelId, name, size.toString()).send({from, gas: 10});
        const { tokenId } = result?.events?.Transfer.returnValues || {
          tokenId: "",
        };

        const sneaker = await contract.methods.sneakers(tokenId).call();

        dispatch({
          type: "ADD_SNEAKER",
          sneaker: { ...sneaker, token: tokenId },
        });
        reset();
        setSuccess(true);
      } catch (error) {
        setError("Failed to mint new sneaker. Check if you have enough gas!");
        console.log(error);
      }
    }
  };

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
              helperText={
                (errors.modelId &&
                  (errors.modelId.type === "required"
                    ? "Model Id is required"
                    : "Model Id has to have between 5 and 15 characters")) ||
                ""
              }
              name="modelId"
              inputRef={register({
                required: true,
                maxLength: 15,
                minLength: 5,
              })}
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
              {loading ? <CircularProgress size={40} /> : 
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              }
            </div>
          </form>
        </Grid>
      </Container>
      <Snackbar
        open={error !== null}
        onClose={() => setError(null)}
        autoHideDuration={5000}
      >
        <Alert severity="error">{error || ""}</Alert>
      </Snackbar>
      <Snackbar
        open={loading}
      >
        <Alert severity="info">Waiting for a token to be mined by the network!</Alert>
      </Snackbar>
      <Snackbar
        open={success}
        onClose={() => setSuccess(false)}
        autoHideDuration={5000}
      >
        <Alert severity="success">
          New token has been minted. Check your inventory!
        </Alert>
      </Snackbar>
    </div>
  );
}
