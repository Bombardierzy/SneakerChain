import { ReactElement } from "react";
import { Button } from "@material-ui/core";
import { Manufacturer } from "../../models/models";
import { ManufacturersTable } from "./ManufacturersTable";

interface VerifiedManufacturersProps {
  manufacturers: Manufacturer[];
  onDelete: (manufacturer: Manufacturer) => void;
}

export function VerifiedManufacturers({
  manufacturers,
  onDelete,
}: VerifiedManufacturersProps): ReactElement {
  return (
    <ManufacturersTable
      title="Verified Manufacturers"
      manufacturers={manufacturers}
    >
      {(row: Manufacturer) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onDelete(row)}
        >
          Delete Manufacturer
        </Button>
      )}
    </ManufacturersTable>
  );
}
