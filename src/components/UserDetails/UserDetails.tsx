import { Avatar, CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import "./UserDetails.scss";
import { useSelector } from "react-redux";
import { RootType } from "../../store";
import React from "react";
import UpdateProfile from "../UpdateProfile/UpdateProfile";
import "lazysizes";
import { UserDetailsProps } from "../../Types/components/UserDetails";

const UserDetails: React.FC<UserDetailsProps> = ({
  handleShowUserChat,
  myData,
  loading,
  item,
  isInChatSection,
}: any) => {
  const userId = Cookies.get("userId");
  const receiverId = useSelector((state: RootType) => state.id.value);
  const [showUpdateProfile, setShowUpdateProfile] =
    React.useState<boolean>(false);
  const [isHover, setIsHover] = React.useState<boolean>(false);

  const handleShowUpdateProfile = () => {
    if (myData && myData?._id == userId) {
      !showUpdateProfile && setShowUpdateProfile(true);
    } else {
      handleShowUserChat(item?._id);
    }
  };

  const handleBackgroundColor = () => {
    if (isInChatSection) {
      if (myData?._id !== userId) {
        return "#7737bf88";
      }
      if (!isHover) {
        return "#7737bf88";
      }
      if (isHover && myData?._id == userId) {
        return "#7737bf";
      }
    }
    if (item && receiverId == item?._id) {
      return "#418eb6";
    }
  };

  return (
    <div
      className="user-details flexStart"
      onClick={handleShowUpdateProfile}
      style={{
        background: handleBackgroundColor(),
        color: isInChatSection ? "white" : "",
        cursor: isInChatSection && myData?._id !== userId ? "" : "pointer",
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="profile-section">
        {!item?.profilePhoto && !myData?.profilePhoto ? (
          <Avatar className="avatar-section" />
        ) : (
          <img
            src={(item ? item : myData)?.profilePhoto}
            alt=""
            loading="lazy"
          />
        )}
      </div>

      {loading && (
        <CircularProgress
          color="primary"
          size={20}
          className="myData-loading"
        />
      )}
      <div className="user-info" style={{ width: myData ? "100%" : "" }}>
        {item && userId === item?._id ? (
          <p>My Account</p>
        ) : (
          <div
            className="user-info-text"
            style={{ width: myData ? "40%" : "" }}
          >
            <p>{myData ? myData?.username : item?.username}</p>
            <span>{myData ? myData?.email : item?.email}</span>
          </div>
        )}
      </div>
      {showUpdateProfile && (
        <UpdateProfile
          myData={myData && myData}
          setShowUpdateProfile={setShowUpdateProfile}
          userId={userId}
        />
      )}
    </div>
  );
};

export default UserDetails;
