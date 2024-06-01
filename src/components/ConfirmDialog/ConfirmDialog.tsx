import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import { ConfirmDialogProps } from "../../Types/components/ConfirmDialog";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  handleLogout,
  handelDeleteUser,
  handleDeleteMessage,
  alertMessage,
}) => {
  const handleConfirm = () => {
    if (handleDeleteMessage && alertMessage.includes("message")) {
      handleDeleteMessage();
    }
    if (handelDeleteUser && alertMessage.includes("account")) {
      handelDeleteUser();
    }
    if (handleLogout && alertMessage.includes("Logout")) {
      handleLogout();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleExit = () => {
    if (onClose) {
      onClose();
    }
  };
  return (
    <Dialog className="logout-alert" open={open} onClose={handleExit}>
      {alertMessage && (
        <DialogTitle>Are you sure you want to {alertMessage} ??</DialogTitle>
      )}
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleExit}>
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
