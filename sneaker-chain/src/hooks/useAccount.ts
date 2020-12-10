import { Sneaker } from "../models/models";
import { useAppContext } from "../contexts/appContext";
import { useEffect } from "react";
import { web3 } from "../Contract";

export const useAccount = () => {
  const [{ account, contract, from }, dispatch] = useAppContext();

  useEffect(() => {
    if (!account && contract && from) {
      const fetchAccountInfo = async () => {
        try {
          const isAdmin = await contract.methods
            .hasRole(web3.utils.keccak256("ADMIN_ROLE"), from)
            .call();
          const isManufacturer = await contract.methods
            .hasRole(web3.utils.keccak256("MANUFACTURER_ROLE"), from)
            .call();

          const sneakerTokens = await contract.methods
            .getSneakersByOwner(from)
            .call();

          let sneakers: Sneaker[] = [];

          for (const token of sneakerTokens) {
            const {
              manufacturer,
              modelId,
              size,
              name,
            } = await contract.methods.sneakers(token).call();

            sneakers.push({ token, manufacturer, modelId, size, name });
          }

          dispatch({
            type: "SET_ACCOUNT",
            account: {
              isAdmin,
              isManufacturer,
              sneakers,
            },
          });
        } catch (error) {
          console.log("Error while fetching account information", error);
        }
      };
      fetchAccountInfo();
    }
  }, [account, contract, from, dispatch]);
  return account;
};
