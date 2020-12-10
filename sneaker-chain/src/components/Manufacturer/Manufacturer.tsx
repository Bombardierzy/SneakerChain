import { CircularProgress, makeStyles } from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";

import { MintToken } from "./MintToken";
import { PendingRequest } from "./PendingRequest";
import { RequestManufacturerRole } from "./RequestManufacturerRole";
import { useAccount } from "../../hooks/useAccount";
import { useAppContext } from "../../contexts/appContext";

const useStyles = makeStyles({
  loading: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 200,
  },
});

// based on if current user is a manufacturer or not MintToken or RequestManufacturerRole should be displayed
export function Manufacturer(): ReactElement {
  const [{ contract, from }] = useAppContext();
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const account = useAccount();

  const classes = useStyles();

  useEffect(() => {
    const checkIfPending = async () => {
      if (contract && from && account && !account.isManufacturer) {
        try {
          const result = await contract.methods
            .requestedManufacturers(from)
            .call();
          if (result !== "0") {
            setIsPending(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
      setIsLoading(false);
    };
    checkIfPending();
  }, [contract, from, account, setIsPending, setIsLoading]);

  if (isLoading || !account) {
    return (
      <div className={classes.loading}>
        <CircularProgress size={100} />
      </div>
    );
  }

  if (isPending) {
    return <PendingRequest />;
  }

  if (!account?.isManufacturer) {
    return <RequestManufacturerRole onSuccess={() => setIsPending(true)} />;
  }

  return <MintToken />;
}
