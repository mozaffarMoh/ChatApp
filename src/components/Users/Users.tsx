import {
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Zoom,
} from "@mui/material";
import "./Users.scss";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { Footer } from "../../sections";
import UserDetails from "../UserDetails/UserDetails";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useGet } from "../../Custom-Hooks";
import { endPoint } from "../../api/endPoint";
import { useDispatch, useSelector } from "react-redux";
import { setReceiverId } from "../../Slices/receiverIdSlice";
import { RootType } from "../../store";
import { setCallerName } from "../../Slices/callerNameSlice";
import { UsersProps } from "../../Types/components/Users";
import LogoutAlert from "../LogoutAlert/LogoutAlert";

const Users: React.FC<UsersProps> = ({ isSmallScreen, setShowUserChat }) => {
  const router = useNavigate();
  const dispatch = useDispatch();
  const [users, setUsers] = React.useState<any>([]);
  const [showLogoutAlert, setShowLogoutAlert] = React.useState<boolean>(false);
  const isProfileUpdated: any = useSelector(
    (state: RootType) => state.refreshUsers.value
  );
  const [name, setName] = React.useState<string>("");
  const userId = Cookies.get("userId");
  const [data, loading, getAllUsers] = useGet(endPoint.allUsers);

  /* Choose user */
  const handleShowUserChat = (id: string) => {
    isSmallScreen && setShowUserChat(true);
    dispatch(setReceiverId(id));
  };

  /* Store data in users array when first initial page */
  React.useEffect(() => {
    if ((data && users.length == 0) || (data && !name)) {
      const srotedUsers = data.sort((item: any) =>
        item._id == userId ? -1 : 1
      );
      setUsers([...srotedUsers]);
    }
  }, [data, name]);

  /* Store the first value of users to user details in chat section*/
  React.useEffect(() => {
    if (users.length > 0) {
      dispatch(setReceiverId(users[0]?._id));
      dispatch(setCallerName(users[0]?.username));
    }
  }, [users]);

  /* Handle search for users */
  const handleSearch = () => {
    const filteredUsers = data.filter((item: any) => {
      const username = item?.username.toLocaleLowerCase();
      const searchValue = name.toLocaleLowerCase();

      if (username?.startsWith(searchValue)) {
        return item;
      }
    });

    setUsers([...filteredUsers]);
  };

  /* Handle search for users by pressing enter*/
  const handleSearchByEnterKey = (e: any) => {
    e.key == "Enter" && handleSearch();
  };

  /* Handle logout */
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    router("/login");
  };

  /* Get users when profile updates */
  React.useEffect(() => {
    if (isProfileUpdated) {
      setUsers([]);
      getAllUsers();
    }
  }, [isProfileUpdated]);

  return (
    <div className="users flexStartColumnItemsCenter">
      <div className="header-container flexBetween">
        <Tooltip
          title="Logout"
          arrow
          TransitionComponent={Zoom}
          placement="right"
        >
          <IconButton
            className="logout-icon-button"
            onClick={() => setShowLogoutAlert(true)}
          >
            <BiLogOut className="logout-icon" size={30} />
          </IconButton>
        </Tooltip>
        <LogoutAlert
          open={showLogoutAlert}
          onClose={() => setShowLogoutAlert(false)}
          handleLogout={handleLogout}
        />
        <div className="header-container-text flexCenter">
          <h1>Users</h1>
        </div>
      </div>
      <div className="search-section flexCenter">
        <TextField
          onKeyDown={handleSearchByEnterKey}
          placeholder="Search"
          onChange={(e: any) => setName(e.target.value)}
        />
        <FaSearch className="search-icon" onClick={handleSearch} />
      </div>
      {loading && (
        <CircularProgress color="info" className="circle-progress-loading" />
      )}
      {users.map((item: any, index: number) => {
        return (
          <UserDetails
            handleShowUserChat={handleShowUserChat}
            key={index}
            item={item}
          />
        );
      })}
      <Footer />
    </div>
  );
};

export default Users;
