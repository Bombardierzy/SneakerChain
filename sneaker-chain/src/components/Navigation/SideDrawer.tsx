import React from "react";
import { ListItemIcon } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import WidgetsIcon from '@material-ui/icons/Widgets';
import CreateIcon from '@material-ui/icons/Create';
import PersonIcon from '@material-ui/icons/Person';
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

  const list = [{text: "Home", iconName: HomeIcon}, 
  {text: "Inventory", iconName: WidgetsIcon}, 
  {text: "Manufacturer", iconName: CreateIcon}, 
  {text: "Admin", iconName: PersonIcon}];

  const drawerContent = () => (
    <div
      className={classes["list"]}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {list.map((item, index) => (
          <ListItem button key={item.text} component={Link} to={`/${item.text.toLowerCase()}`}>
            <ListItemIcon><item.iconName/></ListItemIcon>
            <ListItemText primary={item.text} style={{ textDecoration: 'none' }}/>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer}>
        {drawerContent()}
      </Drawer>
    </div>
  );
}
