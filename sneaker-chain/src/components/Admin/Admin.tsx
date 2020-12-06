import { ReactElement } from "react";
import { Button } from "@material-ui/core";
import { OurManufacturers } from './OurManufacturers';
import { PendingManufacturers } from './PendingManufacturers';
import React, { useState } from "react";

export function Admin(): ReactElement {
  const [showPendingManufacturers, setShowPendingManufacturers] = useState(false);

  return (
    <div>
      <Button
        className="float-right mr-3 mb-2"
        variant="contained"
        color="primary"
        onClick={ () => setShowPendingManufacturers(!showPendingManufacturers)}
      >
      {
        showPendingManufacturers
        ? "Show pending manufacturers"
        : "Show our manufacturers"
      }
      </Button>
      {
        showPendingManufacturers
        ? <OurManufacturers></OurManufacturers>
        : <PendingManufacturers></PendingManufacturers>
      }
    </div>
  );
}
