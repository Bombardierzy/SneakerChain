import { Container } from "@material-ui/core";
import { MintToken } from "./MintToken";
import { ReactElement } from "react";

// based on if current user is a manufacturer or not MintToken or RequestManufacturerRole should be displayed
export function Manufacturer(): ReactElement {
  return (
    <Container>
      <MintToken />
    </Container>
  );
}
