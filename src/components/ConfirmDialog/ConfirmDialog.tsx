import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import { ConfirmDialogProps } from "../../Types/components/ConfirmDialog";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  handleLogout,
  handelDeleteUser,
  alertMessage,
}) => {
  const handleConfirm = () => {
    alertMessage.includes("delete") && handelDeleteUser();
    alertMessage.includes("Logout") && handleLogout();
  };
  return (
    <Dialog className="logout-alert" open={open} onClose={onClose}>
      <DialogTitle>{alertMessage}</DialogTitle>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleConfirm}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
