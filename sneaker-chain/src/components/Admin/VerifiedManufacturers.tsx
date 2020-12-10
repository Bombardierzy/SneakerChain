import { ReactElement, useState } from "react";
import { Button } from "@material-ui/core";
import { Manufacturer } from "../../models/models";
import { ManufacturersTable } from "./ManufacturersTable";
import { GasReminderDialog } from "./GasReminderDialog";

interface VerifiedManufacturersProps {
  manufacturers: Manufacturer[];
  onDelete: (manufacturer: Manufacturer) => void;
}

export function VerifiedManufacturers({
  manufacturers,
  onDelete,
}: VerifiedManufacturersProps): ReactElement {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <ManufacturersTable
      title="Verified Manufacturers"
      manufacturers={manufacturers}
    >
      {(row: Manufacturer) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Delete Manufacturer
          </Button>
          <GasReminderDialog
            open={openDialog}
            onAccept={() => {
              onDelete(row);
              setOpenDialog(false);
            }}
            onCancel={() => setOpenDialog(false)}
          />
        </>
      )}
    </ManufacturersTable>
  );
}
