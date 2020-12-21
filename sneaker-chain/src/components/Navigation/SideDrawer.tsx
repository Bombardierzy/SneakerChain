import CreateIcon from "@material-ui/icons/Create";
import Drawer from "@material-ui/core/Drawer";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { ListItemIcon } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import React from "react";
import WidgetsIcon from "@material-ui/icons/Widgets";
import { makeStyles } from "@material-ui/core/styles";
import { useAccount } from "../../hooks/useAccount";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

interface SideDrawerProps {
  open: boolean;
  toggleOpen: () => void;
}

