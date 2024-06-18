export interface ChatMessagesProps {
  receiverData: any;
  receiverId: string;
  userId: string | any;
  loadingSendMessage: Boolean;
  isSuccessMessage: Boolean;
  isMessageReceived: Boolean;
  setIsMessageReceived: React.Dispatch<React.SetStateAction<boolean>>;
  receiveMessageSound: any;
}
