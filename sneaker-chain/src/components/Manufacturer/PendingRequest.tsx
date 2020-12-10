import { Paper, Typography } from "@material-ui/core";

import { ReactElement } from "react";

export function PendingRequest(): ReactElement {
  return (
    <Typography variant="h3" align="center">
      You are awaiting to be accepted as a manufacturer!
    </Typography>
  );
}
