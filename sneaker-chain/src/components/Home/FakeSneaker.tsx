import { Button, CardActions } from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  actions: {
    justifyContent: "center",
  },
});

interface FakeSneakerProps {
  token: string;
  onNext: () => void;
}

export default function FakeSneaker({ token, onNext }: FakeSneakerProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          Sneaker corresponding to '{token}' has not been found.
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Be careful. You might have just misspelled sneaker token or someone
          may want to take advantage of you. Don't get scammed. It gets really
          expensive within this business...
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button size="small" onClick={onNext}>
          Verify next sneaker
        </Button>
      </CardActions>
    </Card>
  );
}
