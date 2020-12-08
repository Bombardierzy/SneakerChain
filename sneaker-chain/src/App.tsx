import "./App.css";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ContractContext, loadCryptoSneakerContract } from "./Contract";
import React, { useState } from "react";
import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core";

import { Admin } from "./components/Admin/Admin";
import { Home } from "./components/Home/Home";
import { Login } from "./components/Login/Login";
import { Inventory } from "./components/Inventory/Inventory";
import { Manufacturer } from "./components/Manufacturer/Manufacturer";
import SideDrawer from "./components/Navigation/SideDrawer";
import SneakerAppBar from "./components/AppBar/SneakerAppBar";

const TITLE = "Sneaker Chain";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      marginTop: theme.spacing(6),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  })
);

function App() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <ContractContext.Provider value={loadCryptoSneakerContract()}>
      <BrowserRouter>
        <SneakerAppBar
          title={TITLE}
          toggleDrawer={() => setOpenDrawer(!openDrawer)}
        />
        <SideDrawer
          open={openDrawer}
          toggleOpen={() => setOpenDrawer(!openDrawer)}
        />

        <main className={classes.content}>
          <Switch>
            <Route path="/inventory">
              <Inventory />
            </Route>
            <Route path="/manufacturer">
              <Manufacturer />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </ContractContext.Provider>
  );
}

export default App;
