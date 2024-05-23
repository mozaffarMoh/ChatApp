export interface CallSectionProps {
  stream: object | any;
  isVoiceCall: Boolean;
  setIsVoiceCall: React.Dispatch<React.SetStateAction<boolean>>;
  isVideoCall: Boolean;
  setIsVideoCall: React.Dispatch<React.SetStateAction<boolean>>;
  isCallStart: Boolean;
  setIsCallStart: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string | any;
  receiverId: string;
  CallerName: string;
  name: string;
  caller: string;
  callerSignal: object | any;
  isReceiveCall: Boolean;
  setIsReceiveCall: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUserChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CallTime {
  minutes: number;
  seconds: number;
}
