import { ReactElement } from "react";
import { Container } from "@material-ui/core";
import { NewManufacturer } from "./NewManufacturer";
import { AddToken } from "./AddToken";

export function Manufacturer(): ReactElement {
  const account = {
    role: "RandomUser",
  };

  return (
    <Container>
      {account.role === "Manufacturer" ? <AddToken /> : <NewManufacturer />}
    </Container>
  );
}
