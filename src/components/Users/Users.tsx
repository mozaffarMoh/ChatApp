import { TextField } from "@mui/material";
import "./Users.scss";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { Footer } from "../../sections";
import UserDetails from "../UserDetails/UserDetails";

const Users = ({ isSmallScreen, setShowUserChat }: any) => {
  const [name, setName] = React.useState("");

  const handleShowUserChat = () => {
    isSmallScreen && setShowUserChat(true);
  };
  console.log(name);

  return (
    <div className="users flexStartColumnItemsCenter">
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
