import App from "./App";
import { AppContextProvider } from "./contexts/appContext";
import { ReactElement } from "react";

export function AppWrapper(): ReactElement {
  return (
    <AppContextProvider>
      <App />
    </AppContextProvider>
  );
}
