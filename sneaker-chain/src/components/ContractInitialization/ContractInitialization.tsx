import {
  Button,
  Container,
  FormLabel,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ReactElement, useState } from "react";

import FadeIn from "react-fade-in";
import Typing from "react-typing-animation";
import { useAppContext } from "../../contexts/appContext";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  center: {
    position: "absolute",
    left: "50%",
    top: "40%",
    transform: "translate(-50%, -50%)",
  },
  fadeIn: {
    width: 500,
    marginTop: 40,
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  header: {
    display: "inline-block",
    justifyContent: "center",
    marginTop: 10,
    fontSize: 30,
  },
});

export function ContractInitialization(): ReactElement {
  const [{}, dispatch] = useAppContext();
  const [showTextField, setShowTextField] = useState(false);
  const { register, errors, handleSubmit, setError } = useForm();
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = ({ contract }: { contract: string }) => {
    if (contract === "essa") {
      dispatch({ type: "SET_CONTRACT_ADDRESS", contractAddress: contract });
      history.push("/home");
    } else {
      setError("contract", { message: "Contract has not been found" });
    }
  };

  return (
    <Container>
      <Typing
        className={classes.center}
        onFinishedTyping={() => setShowTextField(true)}
      >
        <Typing.Speed ms={20} />
        <Typography variant="h1" className={classes.header}>
          Welcome! Your data will be stolen!
        </Typography>
        <Typing.Delay ms={1000} />
        <Typing.Backspace count={15} />
        <Typography variant="h1" className={classes.header}>
          &nbsp;is secure!
        </Typography>
      </Typing>
      {showTextField ? (
        <FadeIn delay={500} className={classes.fadeIn}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Contract"
              error={errors?.contract}
              helperText={errors?.contract?.message || ""}
              name="contract"
              inputRef={register({ required: true })}
              type="text"
              className="w-100"
            ></TextField>
            <div className="text-center mt-4">
              <Button type="submit" color="primary" variant="contained">
                Load contract
              </Button>
            </div>
          </form>
        </FadeIn>
      ) : (
        <></>
      )}
    </Container>
  );
}
