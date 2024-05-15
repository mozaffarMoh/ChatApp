import { Avatar, CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import "./UserDetails.scss";
import { useSelector } from "react-redux";
import { RootType } from "../../store";
import React from "react";
import UpdateProfile from "../UpdateProfile/UpdateProfile";

const UserDetails = ({
  handleShowUserChat,
  myData,
  loading,
  item,
  isInChatSection,
}: any) => {
  const userId = Cookies.get("userId");
  const receiverId: any = useSelector((state: RootType) => state.id.value);
  const [showUpdateProfile, setShowUpdateProfile] = React.useState(false);

  const handleShowUpdateProfile = () => {
    if (myData && myData?._id == userId) {
      setShowUpdateProfile(false);
    }
  };
  return (
    <div
      className="user-details flexStart"
      onClick={() => handleShowUserChat(item?._id)}
      style={{
        background: isInChatSection
          ? "#7737bf88"
          : receiverId == item?._id
          ? "#418eb6"
          : "",
        color: isInChatSection ? "white" : "",
      }}
    >
      <div onClick={handleShowUpdateProfile}>
        {!item?.profilePhoto ? (
          <Avatar className="avatar-section" />
        ) : (
          <img src={item?.profilePhoto} alt="" />
        )}
      </div>
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
      {showUpdateProfile && <UpdateProfile />}
    </div>
  );
};

export default UserDetails;
