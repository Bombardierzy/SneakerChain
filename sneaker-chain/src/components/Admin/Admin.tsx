import { ReactElement, useState } from "react";
import { VerifiedManufacturers } from "./VerifiedManufacturers";
import { PendingManufacturers } from "./PendingManufacturers";
import React from "react";
import { Manufacturer } from "../../models/models";

export function Admin(): ReactElement {
  const [verifiedManufacturers, setVerifiedManufacturers] = useState([
    {
      name: "Balenciaga",
      street: "Aleja jana marcina 35",
      city: "Pacanów",
      postalCode: "23-356",
      state: "lubelski",
      country: "Hiszpania",
    },
    {
      name: "Essa Buty",
      street: "Bylegdzie 3",
      city: "Wytrzyszczka",
      postalCode: "23-231",
      state: "malopolska",
      country: "Polska",
    },
  ]);

  const [pendingManufacturers, setPendingManufacturers] = useState([
    {
      name: "Nike",
      street: "Aleja jana długosza 5",
      city: "Kraków",
      postalCode: "33-333",
      state: "malopolska",
      country: "Polska",
    },
    {
      name: "Adidas",
      street: "Krakowska 3",
      city: "Wytrzyszczka",
      postalCode: "23-231",
      state: "malopolska",
      country: "Polska",
    },
  ]);

  return (
    <>
      <PendingManufacturers
        manufacturers={pendingManufacturers}
        onDeny={(manufacturer: Manufacturer) =>
          setPendingManufacturers(
            pendingManufacturers.filter((element) => element !== manufacturer)
          )
        }
        onAccept={(manufacturer: Manufacturer) => {
          setPendingManufacturers(
            pendingManufacturers.filter((element) => element !== manufacturer)
          );
          setVerifiedManufacturers([...verifiedManufacturers, manufacturer]);
        }}
      />
      <VerifiedManufacturers
        manufacturers={verifiedManufacturers}
        onDelete={(manufacturer: Manufacturer) =>
          setVerifiedManufacturers(
            verifiedManufacturers.filter((element) => element !== manufacturer)
          )
        }
      />
    </>
  );
}
