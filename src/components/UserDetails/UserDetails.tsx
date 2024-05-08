import { Avatar } from "@mui/material";
import "./UserDetails.scss";

const UserDetails = ({
  handleShowUserChat,
  name,
  email,
  isInChatSection,
}: any) => {
  return (
    <div
      className="user-details flexStart"
      onClick={handleShowUserChat}
      style={{
        background: isInChatSection ? "#7737bf" : "",
        color : isInChatSection ? "white" : "",
        cursor: isInChatSection ? "default" : "",
      }}
    >
      <Avatar />
      <div className="user-text">
        <p>{name}</p>
        <span>{email}</span>
      </div>
    </div>
  );
};

export default UserDetails;
