import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import { Sneaker } from "../../models/models";
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

interface OriginalSneakerProps {
  sneaker: Sneaker & { owner: string };
  onNext: () => void;
}

export default function OriginalSneaker({
  sneaker,
  onNext,
}: OriginalSneakerProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Token: {sneaker.token} is valid. Sneaker is original
        </Typography>
        <Typography variant="h5" component="h2">
          {sneaker.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Manufacturer: <br /> {sneaker.manufacturer}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Owner: <br />
          {sneaker.owner}
        </Typography>
        <Typography variant="body2" component="p">
          Model Id: {sneaker.modelId}
        </Typography>
        <Typography variant="body2" component="p">
          Size: {sneaker.size}
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
