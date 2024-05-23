import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

interface LogoutAlertProps {
  open: Boolean | any;
  onClose: React.Dispatch<React.SetStateAction<boolean>> | any;
  handleLogout: () => void;
}

const LogoutAlert: React.FC<LogoutAlertProps> = ({
  open,
  onClose,
  handleLogout,
}) => {
  return (
    <Dialog className="logout-alert" open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to logout ??</DialogTitle>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutAlert;
