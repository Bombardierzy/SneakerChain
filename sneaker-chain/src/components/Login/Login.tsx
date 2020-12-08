import {
  makeStyles,
  Typography,
  TextField,
  Container,
  FormLabel,
  Button,
} from "@material-ui/core";
import { ReactElement, useState } from "react";
import Typing from "react-typing-animation";
import FadeIn from "react-fade-in";
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
    width: "50%",
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

export function Login(): ReactElement {
  const [showTextField, setShowTextField] = useState(false);
  const { register, errors, handleSubmit } = useForm();
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = (data: { contract: string }) => {
    if (data.contract === "essa") {
      history.push("/Home");
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
        <Typing.Backspace count={7} />
        <Typography variant="h1" className={classes.header}>
          &nbsp;secure!
        </Typography>
      </Typing>
      {showTextField ? (
        <FadeIn delay={500} className={classes.fadeIn}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormLabel
              hidden={errors.contract}
              htmlFor="nameLabel"
              className="ml-2"
            >
              Contract
            </FormLabel>
            <FormLabel
              hidden={!errors.contract}
              htmlFor="nameLabel"
              error={true}
            >
              Contract is required
            </FormLabel>
            <br />
            <TextField
              error={errors.contract}
              name="contract"
              inputRef={register({ required: true })}
              type="text"
              className="w-100"
            ></TextField>
            <div className="text-center mt-4">
              <Button type="submit" color="primary" variant="contained">
                Send contract
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
