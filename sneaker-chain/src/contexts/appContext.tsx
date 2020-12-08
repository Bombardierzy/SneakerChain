import React, { ReactNode, useReducer } from "react";
import appReducer, {
  AppActions,
  AppStoreInterface,
  appInitialState,
} from "./appReducer";

interface Props {
  children: ReactNode;
}

export type AppContextType = [AppStoreInterface, React.Dispatch<AppActions>];

export const Context = React.createContext<AppContextType>([
  appInitialState,
  () => null,
]);

export let dispatchToApp: React.Dispatch<AppActions> = () => null;

export function AppContextProvider({ children }: Props): JSX.Element {
  const [store, dispatch] = useReducer(appReducer, appInitialState);
  dispatchToApp = dispatch;

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
}

export function useAppContext(): AppContextType {
  return React.useContext(Context);
}
