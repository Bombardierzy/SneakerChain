import App from "./App";
import { AppContextProvider } from "./contexts/appContext";
import { BrowserRouter } from "react-router-dom";
import { ReactElement } from "react";

export function AppWrapper(): ReactElement {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppContextProvider>
  );
}
