import { ReactElement, useState } from "react";
import { Button } from "@material-ui/core";
import { Manufacturer } from "../../models/models";
import { ManufacturersTable } from "./ManufacturersTable";
import { ManufacturerDialog } from "./ManufacturerDialog";

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
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openDenyDialog, setOpenDenyDialog] = useState(false);

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
            onClick={() => setOpenAcceptDialog(true)}
          >
            Accept
          </Button>
          <Button
            className="ml-2"
            variant="contained"
            color="secondary"
            onClick={() => setOpenDenyDialog(true)}
          >
            Deny
          </Button>
          <ManufacturerDialog
            open={openAcceptDialog || openDenyDialog}
            onAccept={() => {
              if (openAcceptDialog) onAccept(row);
              else if (openDenyDialog) onDeny(row);
              setOpenAcceptDialog(false);
              setOpenDenyDialog(false);
            }}
            onCancel={() => {
              setOpenAcceptDialog(false);
              setOpenDenyDialog(false);
            }}
          />
        </>
      )}
    </ManufacturersTable>
  );
}
