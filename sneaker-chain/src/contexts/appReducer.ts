import { CryptoSneaker } from "../contracts/CryptoSneaker";

export type AppActions =
  | { type: "SET_CONTRACT_ADDRESS"; contractAddress: string }
  | { type: "SET_CONTRACT"; contract: CryptoSneaker }
  | { type: "SET_FROM"; from: string };

export interface AppStoreInterface {
  contractAddress: string;
  contract: CryptoSneaker | null;
  from: string | null;
}

export const appInitialState: AppStoreInterface = {
  contractAddress: "",
  contract: null,
  from: null,
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
    default:
      return state;
  }
}
