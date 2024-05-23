export interface ChatMessagesProps {
  receiverId: string;
  userId: string | any;
  loadingSendMessage: Boolean;
  isSuccessMessage: Boolean;
  isMessageReceived: Boolean;
  setIsMessageReceived: React.Dispatch<React.SetStateAction<boolean>>;
  receiveMessageSound: any;
}
