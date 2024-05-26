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
import Cookies from "js-cookie";
import { useDelete, useGet } from "../../Custom-Hooks";
import { endPoint } from "../../api/endPoint";
import { useDispatch, useSelector } from "react-redux";
import { setReceiverId } from "../../Slices/receiverIdSlice";
import { RootType } from "../../store";
import { setCallerName } from "../../Slices/callerNameSlice";
import { UsersProps } from "../../Types/components/Users";
import { MdNoAccounts } from "react-icons/md";
import Loading from "../Loading/Loading";
import { ToastContainer, toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

const Users: React.FC<UsersProps> = ({ isSmallScreen, setShowUserChat }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = React.useState<any>([]);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [alertMessage, setAlertMessage] = React.useState<string>("");
  const isProfileUpdated: any = useSelector(
    (state: RootType) => state.refreshUsers.value
  );
  const [name, setName] = React.useState<string>("");
  const userId = Cookies.get("userId");
  const [data, loading, getAllUsers] = useGet(endPoint.allUsers);
  const [, logoutLoading, handleLogout, , errorMessageLogout] = useGet(
    endPoint.logout
  );
  const [handelDeleteUser, deleteUserLoading, errorMessage, successMessage] =
    useDelete(endPoint.deleteUser + userId);

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

  /* Get users when profile updates */
  React.useEffect(() => {
    if (isProfileUpdated) {
      setUsers([]);
      getAllUsers();
    }
  }, [isProfileUpdated]);

  /* Check confirm before logout */
  const handleConfirmLogout = () => {
    setShowAlert(true);
    setAlertMessage("Logout");
  };

  /* Check confirm before delete account */
  const handleConfirmDeleteAccount = () => {
    setShowAlert(true);
    setAlertMessage("delete your account");
  };

  /* Close confirm dialog */
  const onCloseConfirm = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  /* show error or success message if delete account success or fail */
  const DeleteSuccess = () => toast(successMessage);
  const DeleteFail = () => toast(errorMessage);
  const LogoutFail = () => toast(errorMessageLogout);
  React.useEffect(() => {
    if (!deleteUserLoading) {
      if (successMessage) {
        DeleteSuccess();
        setShowAlert(false);
      }
      errorMessage && DeleteFail();
      errorMessageLogout && LogoutFail();
    }
  }, [successMessage, errorMessage, errorMessageLogout]);

  return (
    <div className="users flexStartColumnItemsCenter">
      <ToastContainer />
      {(deleteUserLoading || logoutLoading) && <Loading />}
      <div className="header-container flexBetween">
        <Tooltip
          title="Delete Account"
          arrow
          TransitionComponent={Zoom}
          placement="bottom"
        >
          <IconButton
            className="logout-icon-button"
            onClick={handleConfirmDeleteAccount}
          >
            <MdNoAccounts className="logout-icon" size={30} />
          </IconButton>
        </Tooltip>

        <ConfirmDialog
          open={showAlert}
          onClose={onCloseConfirm}
          handleLogout={handleLogout}
          handelDeleteUser={handelDeleteUser}
          alertMessage={alertMessage}
        />
        <div className="header-container-text flexCenter">
          <h1>Users</h1>
        </div>
        <Tooltip
          title="Logout"
          arrow
          TransitionComponent={Zoom}
          placement="bottom"
        >
          <IconButton
            className="logout-icon-button"
            onClick={handleConfirmLogout}
          >
            <BiLogOut className="logout-icon" size={30} />
          </IconButton>
        </Tooltip>
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
