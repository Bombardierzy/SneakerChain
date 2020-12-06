import { ReactElement } from "react";
import { Container, Grid } from '@material-ui/core';
import { NewManufacturer } from './NewManufacturer'
import { AddToken } from './AddToken'

export function Manufacturer(): ReactElement {

  const Account = {
    role: "RandomUser"
  }

  return (
    <div>
     <Container>
        <Grid>
          {
            Account.role === "Manufacturer"
            ? <AddToken></AddToken>
            : <NewManufacturer></NewManufacturer>
          }
        </Grid>
      </Container>
    </div>
  );
}
