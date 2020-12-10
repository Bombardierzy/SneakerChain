import { Account, PendingManufacturer, Sneaker } from "../models/models";

import { CryptoSneaker } from "../contracts/CryptoSneaker";

export type AppActions =
  | { type: "SET_CONTRACT_ADDRESS"; contractAddress: string }
  | { type: "SET_CONTRACT"; contract: CryptoSneaker }
  | { type: "SET_FROM"; from: string }
  | { type: "SET_ACCOUNT"; account: Account }
  | { type: "ADD_SNEAKER"; sneaker: Sneaker }
  | { type: "REMOVE_SNEAKER"; sneaker: Sneaker }
  | {
      type: "SET_MANUFACTURERS";
      verified: string[];
      pending: PendingManufacturer[];
    }
  | { type: "ACCEPT_MANUFACTURER"; manufacturer: { address: string } }
  | { type: "DENY_MANUFACTURER"; manufacturer: { address: string } };

export interface AppStoreInterface {
  contractAddress: string;
  contract: CryptoSneaker | null;
  from: string | null;
  account: Account | null;
  pendingManufacturers: PendingManufacturer[] | null;
  verifiedManufacturers: string[] | null;
}

export const appInitialState: AppStoreInterface = {
  contractAddress: "",
  contract: null,
  from: null,
  account: null,
  pendingManufacturers: null,
  verifiedManufacturers: null,
};

export default function appReducer(
  state: AppStoreInterface = appInitialState,
  action: AppActions
): AppStoreInterface {
  switch (action.type) {
    case "SET_CONTRACT_ADDRESS":
      return { ...state, contractAddress: action.contractAddress };
    case "SET_CONTRACT":
      return { ...state, contract: action.contract };
    case "SET_FROM":
      return { ...state, from: action.from };
    case "SET_ACCOUNT":
      return { ...state, account: action.account };
    case "ADD_SNEAKER":
      if (state.account) {
        const { sneakers } = state.account;
        sneakers.push(action.sneaker);
        return { ...state, account: { ...state.account, sneakers } };
      }
      return state;
    case "REMOVE_SNEAKER":
      if (state.account) {
        const { sneakers } = state.account;
        return {
          ...state,
          account: {
            ...state.account,
            sneakers: sneakers.filter((s) => s.token !== action.sneaker.token),
          },
        };
      }
      return state;
    case "SET_MANUFACTURERS": {
      return {
        ...state,
        verifiedManufacturers: action.verified,
        pendingManufacturers: action.pending,
      };
    }
    case "ACCEPT_MANUFACTURER": {
      const { verifiedManufacturers, pendingManufacturers } = state;
      const { address } = action.manufacturer;
      verifiedManufacturers?.push(address);
      const pending =
        pendingManufacturers?.filter((el) => el.address !== address) || [];
      return { ...state, verifiedManufacturers, pendingManufacturers: pending };
    }
    case "DENY_MANUFACTURER": {
      const { pendingManufacturers } = state;
      const { address } = action.manufacturer;
      const pending =
        pendingManufacturers?.filter((el) => el.address !== address) || [];
      return { ...state, pendingManufacturers: pending };
    }
    default:
      return state;
  }
}
