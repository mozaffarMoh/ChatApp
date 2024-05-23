export interface ConfirmDialogProps {
    open: Boolean | any;
    onClose: React.Dispatch<React.SetStateAction<boolean>> | any;
    handleLogout: () => void;
    handelDeleteUser: () => void;
    alertMessage: string;
}