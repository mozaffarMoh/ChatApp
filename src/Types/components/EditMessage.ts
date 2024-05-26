export interface EditMessageProps {
  message: string;
  messageId: string;
  setShowEditMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMessageSetting: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorEditMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsMessageEdited: React.Dispatch<React.SetStateAction<boolean>>;
}
