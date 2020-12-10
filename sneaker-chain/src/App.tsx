import "./App.css";

import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core";

import { Admin } from "./components/Admin/Admin";
import { ContractInitialization } from "./components/ContractInitialization/ContractInitialization";
import { Home } from "./components/Home/Home";
import { Inventory } from "./components/Inventory/Inventory";
import { Manufacturer } from "./components/Manufacturer/Manufacturer";
import SideDrawer from "./components/Navigation/SideDrawer";
import SneakerAppBar from "./components/AppBar/SneakerAppBar";
import { useAccount } from "./hooks/useAccount";
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
  const [{ contract }] = useAppContext();
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const classes = useStyles(theme);
  const history = useHistory();
  const account = useAccount();

  useEffect(() => {
    if (!contract && history) {
      history.push("/initialization");
    }
  }, [history, contract]);

  return (
    <>
      {contract && (
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
          {account && account.isAdmin && (
            <Route path="/admin">
              <Admin />
            </Route>
          )}
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
