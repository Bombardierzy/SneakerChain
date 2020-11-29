import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

interface SideDrawerProps {
  open: boolean;
  toggleOpen: () => void;
}
export default function SideDrawer({ open, toggleOpen }: SideDrawerProps) {
  const classes = useStyles();

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    toggleOpen();
  };

  const list = () => (
    <div
      className={classes["list"]}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {["Home", "Inventory", "Manufacturer", "Admin"].map((text, index) => (
          <Link to={`/${text.toLowerCase()}`}>
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer}>
        {list()}
      </Drawer>
    </div>
  );
}
