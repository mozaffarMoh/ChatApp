import "./ChatSection.scss";

const ChatSection = ({ setShowUserChat, isSmallScreen }: any) => {
  return (
    <div className="chat-section flexCenterColumn">
      <h1>Chat section</h1>
      {isSmallScreen && (
        <button onClick={() => setShowUserChat(false)}>Back</button>
      )}
    </div>
  );
};

export default ChatSection;
