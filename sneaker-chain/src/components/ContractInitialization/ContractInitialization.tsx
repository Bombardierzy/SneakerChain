import {
  Button,
  CircularProgress,
  Container,
  FormLabel,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";
import { loadCryptoSneakerContract, web3 } from "../../Contract";

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

const CONTRACT_ADDRESS = "CONTRACT_ADDRESS";

export function ContractInitialization(): ReactElement {
  const [{}, dispatch] = useAppContext();
  const [showTextField, setShowTextField] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, errors, handleSubmit, setError } = useForm();
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = async ({
    contractAddress,
  }: {
    contractAddress: string;
  }): Promise<void> => {
    setLoading(true);
    try {
      const code = await web3.eth.getCode(contractAddress);
      if (code === "0x") {
        setError("contractAddress", { message: "Contract has not been found" });
      } else {
        const contract = loadCryptoSneakerContract(contractAddress);

        dispatch({ type: "SET_CONTRACT", contract });
        localStorage.setItem(CONTRACT_ADDRESS, contractAddress);
        history.push("/home");
      }
    } catch (e) {
      console.log(e);
      setError("contractAddress", {
        message: "Unknown message, please try again later...",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const contractAddress = localStorage.getItem(CONTRACT_ADDRESS);
    if (contractAddress) {
      const fetchContract = async () => {
        try {
          const code = await web3.eth.getCode(contractAddress);
          if (code === "0x") {
            localStorage.removeItem(CONTRACT_ADDRESS);
          } else {
            const contract = loadCryptoSneakerContract(contractAddress);

            dispatch({ type: "SET_CONTRACT", contract });
            history.push("/home");
          }
        } catch (e) {
          localStorage.removeItem(CONTRACT_ADDRESS);
        }
      };
      fetchContract();
    }
  }, [dispatch]);

  const errorMessage = (
    error: { type: string; message: string } | null | undefined
  ): string => {
    if (!error) return "";

    switch (error.type) {
      case "required": {
        return "Contract address is required";
      }
      case "pattern": {
        return "Invalid address pattern, make sure it has 40 characters and consists of lowercase letters and digits";
      }
      default:
        return error.message;
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
              error={errors?.contractAddress}
              helperText={errorMessage(errors?.contractAddress)}
              name="contractAddress"
              inputRef={register({
                required: true,
                pattern: /^[a-z0-9]{42}$/i,
              })}
              type="text"
              className="w-100"
            ></TextField>
            <div className="text-center mt-4">
              {loading ? (
                <CircularProgress />
              ) : (
                <Button type="submit" color="primary" variant="contained">
                  Load contract
                </Button>
              )}
            </div>
          </form>
        </FadeIn>
      ) : (
        <></>
      )}
    </Container>
  );
}
