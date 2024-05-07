import { Avatar, Icon, TextField } from "@mui/material";
import "./Users.scss";
import React from "react";
import { FaSearch } from "react-icons/fa";

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
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
      <div className="user-section flexStart" onClick={handleShowUserChat}>
        <Avatar />
        <div className="user-details">
          <p>Feras</p>
          <span>ferawwwess@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Users;
