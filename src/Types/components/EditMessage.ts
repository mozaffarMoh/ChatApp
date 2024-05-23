export interface EditMessageProps {
  message: string;
  messageId: string;
  setShowEditMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageEdited: React.Dispatch<React.SetStateAction<boolean>>;
}
