export interface UserDetailsProps {
  handleShowUserChat?: (id: string) => void;
  myData?: object;
  loading?: Boolean;
  item?: object;
  isInChatSection?: Boolean;
  isSmallScreen?: Boolean;
  setShowUserChat?: React.Dispatch<React.SetStateAction<boolean>>;
}
