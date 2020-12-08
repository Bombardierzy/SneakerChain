import "./App.css";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import React, { useState } from "react";
import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core";

import { Admin } from "./components/Admin/Admin";
import { Home } from "./components/Home/Home";
import { ContractInitialization } from "./components/ContractInitialization/ContractInitialization";
import { Inventory } from "./components/Inventory/Inventory";
import { Manufacturer } from "./components/Manufacturer/Manufacturer";
import SideDrawer from "./components/Navigation/SideDrawer";
import SneakerAppBar from "./components/AppBar/SneakerAppBar";
import { useAppContext } from "./contexts/appContext";

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
  // based on this contract variable we should be redirected to contract initialization page
  const [{ contract }] = useAppContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
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
          <Route path="/initialization">
            <ContractInitialization />
          </Route>
          <Route exact path="/">
            <Redirect to="/initialization" />
          </Route>
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
