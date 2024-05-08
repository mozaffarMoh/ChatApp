import { IconButton, TextField, Tooltip, Zoom } from "@mui/material";
import "./Users.scss";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { Footer } from "../../sections";
import UserDetails from "../UserDetails/UserDetails";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Users = ({ isSmallScreen, setShowUserChat }: any) => {
  const router = useNavigate();
  const [name, setName] = React.useState("");

  const handleShowUserChat = () => {
    isSmallScreen && setShowUserChat(true);
  };
  console.log(name);

  const handleLogout = () => {
    Cookies.remove("token");
    router("/login");
  };
  return (
    <div className="users flexStartColumnItemsCenter">
      <Tooltip
        title="Logout"
        arrow
        TransitionComponent={Zoom}
        placement="right"
      >
        <IconButton className="logout-icon-button" onClick={handleLogout}>
          <BiLogOut className="logout-icon" size={30} />
        </IconButton>
      </Tooltip>
      <h1>Users</h1>
      <div className="search-section flexCenter">
        <TextField
          placeholder="Search"
          onChange={(e: any) => setName(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      {Array(12)
        .fill("")
        .map((_, index) => {
          return (
            <UserDetails
              handleShowUserChat={handleShowUserChat}
              key={index}
              name="Feras"
              email="ferawwwess@gmail.com"
            />
          );
        })}
      <Footer />
    </div>
  );
};

export default Users;
