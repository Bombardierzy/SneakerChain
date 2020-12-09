import "./App.css";

import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core";

import { Admin } from "./components/Admin/Admin";
import { ContractInitialization } from "./components/ContractInitialization/ContractInitialization";
import { Home } from "./components/Home/Home";
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
  const [{ contractAddress }] = useAppContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const classes = useStyles(theme);
  const history = useHistory();

  useEffect(() => {
    console.log("should push", contractAddress, history);
    if (contractAddress === "" && history) {
      history.push("/initialization");
    }
  }, [history, contractAddress]);

  return (
    <>
      {contractAddress !== "" && (
        <SneakerAppBar
          title={TITLE}
          toggleDrawer={() => setOpenDrawer(!openDrawer)}
        />
      )}
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
    </>
  );
}

export default App;
