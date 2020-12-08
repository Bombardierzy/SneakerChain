import { ReactElement } from "react";
import { Button } from "@material-ui/core";
import { Manufacturer } from "../../models/models";
import { ManufacturersTable } from "./ManufacturersTable";

interface PendingManufacturersProps {
  manufacturers: Manufacturer[];
  onDeny: (manufacturer: Manufacturer) => void;
  onAccept: (manufacturer: Manufacturer) => void;
}

export function PendingManufacturers({
  manufacturers,
  onDeny,
  onAccept,
}: PendingManufacturersProps): ReactElement {
  return (
    <ManufacturersTable
      title="Pending Manufacturers"
      manufacturers={manufacturers}
    >
      {(row: Manufacturer) => (
        <>
          <Button
            className="mr-2"
            variant="contained"
            color="primary"
            onClick={() => onAccept(row)}
          >
            Accept
          </Button>
          <Button
            className="ml-2"
            variant="contained"
            color="secondary"
            onClick={() => onDeny(row)}
          >
            Deny
          </Button>
        </>
      )}
    </ManufacturersTable>
  );
}
