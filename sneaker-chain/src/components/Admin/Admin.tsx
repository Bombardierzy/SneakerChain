import { CircularProgress, makeStyles } from "@material-ui/core";
import { Manufacturer, PendingManufacturer } from "../../models/models";
import { ReactElement, useEffect, useState } from "react";

import { PendingManufacturers } from "./PendingManufacturers";
import React from "react";
import { VerifiedManufacturers } from "./VerifiedManufacturers";
import { useAppContext } from "../../contexts/appContext";
import { web3 } from "../../Contract";

const useStyles = makeStyles({
  loading: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 200,
  },
});

export function Admin(): ReactElement {
  const [
    { contract, from, verifiedManufacturers, pendingManufacturers },
    dispatch,
  ] = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const classes = useStyles();

  useEffect(() => {
    const loadManufacturers = async () => {
      if (contract && (!verifiedManufacturers || !pendingManufacturers)) {
        try {
          const pendingRole = web3.utils.keccak256("PENDING_MANUFACTURER");
          const verifiedRole = web3.utils.keccak256("MANUFACTURER_ROLE");

          let a = await contract.methods.getRoleMemberCount(pendingRole).call();
          console.log(a);
          const pendingCount = parseInt(a);

          a = await contract.methods.getRoleMemberCount(verifiedRole).call();
          console.log(a);
          const verifiedCount = parseInt(a);

          console.log(pendingCount, verifiedCount);

          let pending: PendingManufacturer[] = [];
          for (let i = 0; i < pendingCount; i++) {
            const address = await contract.methods
              .getRoleMember(pendingRole, i)
              .call();
            const amount = await contract.methods
              .requestedManufacturers(address)
              .call();
            pending.push({ address, amount });
          }

          let verified: string[] = [];
          for (let i = 0; i < verifiedCount; i++) {
            const address = await contract.methods
              .getRoleMember(verifiedRole, i)
              .call();
            verified.push(address);
          }

          console.log(verified);
          console.log(pending);

          dispatch({ type: "SET_MANUFACTURERS", verified, pending });
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    };

    loadManufacturers();
  }, [contract, verifiedManufacturers, pendingManufacturers, dispatch]);

  const acceptManufacturer = async ({
    address,
    amount,
  }: PendingManufacturer) => {
    if (contract && from) {
      try {
        await contract.methods
          .approveManufacturer(address, amount)
          .send({ from, gas: 300000 });
        dispatch({ type: "ACCEPT_MANUFACTURER", manufacturer: { address } });
      } catch (error) {
        setError(
          "Failed to accept manufacturer, make sure you have enought gas!"
        );
        console.log(error);
      }
    }
  };

  const denyManufacturer = async ({ address, amount }: PendingManufacturer) => {
    if (contract && from) {
      try {
        await contract.methods
          .disapproveManufacturer(address)
          .send({ from, gas: 300000 });
        dispatch({ type: "DENY_MANUFACTURER", manufacturer: { address } });
      } catch (error) {
        setError(
          "Failed to deny manufacturer, make sure you have enought gas!"
        );
        console.log(error);
      }
    }
  };

  if (loading || !pendingManufacturers || !verifiedManufacturers) {
    return (
      <div className={classes.loading}>
        <CircularProgress size={100} />
      </div>
    );
  }

  return (
    <>
      <PendingManufacturers
        manufacturers={pendingManufacturers!!}
        onDeny={(manufacturer: PendingManufacturer) => {
          denyManufacturer(manufacturer);
        }}
        onAccept={(manufacturer: PendingManufacturer) => {
          acceptManufacturer(manufacturer);
        }}
      />
      <VerifiedManufacturers manufacturers={verifiedManufacturers!!} />
    </>
  );
}
