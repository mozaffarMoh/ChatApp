import { Avatar, CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import "./UserDetails.scss";
import { useSelector } from "react-redux";
import { RootType } from "../../store";

const UserDetails = ({
  handleShowUserChat,
  myData,
  loading,
  item,
  isInChatSection,
}: any) => {
  const userId = Cookies.get("userId");
  const receiverId: any = useSelector((state: RootType) => state.id.value);

  return (
    <div
      className="user-details flexStart"
      onClick={() => handleShowUserChat(item?._id)}
      style={{
        background: isInChatSection
          ? "#7737bf"
          : receiverId == item?._id
          ? "#418eb6"
          : "",
        color: isInChatSection ? "white" : "",
        cursor: isInChatSection ? "default" : "",
      }}
    >
      <Avatar />
      {loading && (
        <CircularProgress
          color="primary"
          size={20}
          className="myData-loading"
        />
      )}
      <div className="user-text">
        {item && userId === item?._id ? (
          <p>My Account</p>
        ) : (
          <div>
            <p>{myData ? myData?.username : item?.username}</p>
            <span>{myData ? myData?.email : item?.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
