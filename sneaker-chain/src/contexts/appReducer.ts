import { CryptoSneakerContract } from "../contracts";

export type AppActions =
  | { type: "SET_CONTRACT_ADDRESS"; contractAddress: string }
  | { type: "SET_CONTRACT"; contract: CryptoSneakerContract };

export interface AppStoreInterface {
  contractAddress: string;
  contract: CryptoSneakerContract | null;
}

export const appInitialState: AppStoreInterface = {
  contractAddress: "",
  contract: null,
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
    default:
      return state;
  }
}
