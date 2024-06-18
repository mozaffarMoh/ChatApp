import {
  CircularProgress,
  IconButton,
  Stack,
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
import { useDelete, useGet, usePost } from "../../Custom-Hooks";
import { endPoint } from "../../api/endPoint";
import { useDispatch, useSelector } from "react-redux";
import { setReceiverId } from "../../Slices/receiverIdSlice";
import { RootType } from "../../store";
import { setCallerName } from "../../Slices/callerNameSlice";
import { UsersProps } from "../../Types/components/Users";
import { MdNoAccounts } from "react-icons/md";
import Loading from "../Loading/Loading";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useUsersContext } from "../../Context/UsersProvider";
import { setIsUsersRefresh } from "../../Slices/refreshUsers";

const Users: React.FC<UsersProps> = ({ isSmallScreen, setShowUserChat }) => {
  const dispatch = useDispatch();
  const { users, setUsers }: any = useUsersContext();
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [alertMessage, setAlertMessage] = React.useState<string>("");
  const isUsersRefresh: any = useSelector(
    (state: RootType) => state.refreshUsers.value
  );
  const [name, setName] = React.useState<string>("");
  const receiverId = useSelector((state: RootType) => state.id.value);
  const userId = Cookies.get("userId");
  const [data, loading, getAllUsers, success] = useGet(
    endPoint.allUsers + userId + "?page=" + users.page
  );
  const [, logoutLoading, handleLogout, , errorMessageLogout] = useGet(
    endPoint.logout
  );
  const [
    handleSearchPost,
    filteredUsersLoading,
    ,
    ,
    filteredUsers,
    ,
    setFilteredUsersData,
  ]: any = usePost(endPoint.searchUsers, { name: name });
  const [handelDeleteUser, deleteUserLoading, errorMessage, successMessage] =
    useDelete(endPoint.deleteUser + "?userId=" + userId);

  /* Choose user */
  const handleShowUserChat = (id: string) => {
    isSmallScreen && setShowUserChat(true);
    dispatch(setReceiverId(id));
  };

  /* Store data in users array when first initial page */
  React.useEffect(() => {
    if (data?.users) {
      setName("");
      setFilteredUsersData([]);
      setUsers((prevCache: any) => {
        return { ...prevCache, users: data?.users };
      });
    }
  }, [data]);

  React.useEffect(() => {
    isUsersRefresh && dispatch(setIsUsersRefresh(false));
  }, [success]);

  /* Get users when profile updates */
  React.useEffect(() => {
    if (isUsersRefresh) {
      getAllUsers();
    }
  }, [isUsersRefresh]);

  React.useEffect(() => {
    if (filteredUsers?.users) {
      setUsers((prevCache: any) => {
        return { ...prevCache, users: filteredUsers?.users };
      });
    }
  }, [filteredUsers]);

  /* Store the first value of users to user details in chat section*/
  React.useEffect(() => {
    if (users?.users && users.users.length > 0) {
      !receiverId && dispatch(setReceiverId(users.users[0]._id));
      dispatch(setCallerName(users.users[0].username));
    }
  }, [users?.users]);

  /* Handle search for users */
  const handleSearch = () => {
    name ? handleSearchPost() : getAllUsers();
  };

  const handleIncreasePage = () => {
    let count = users.page * 10;
    if ((users.page > 1 && users.length == count) || users.page == 1) {
      setUsers((prevCache: any) => {
        return { ...prevCache, page: users.page + 1 };
      });
    } else {
      getAllUsers();
    }
  };

  React.useEffect(() => {
    let count = (users.page - 1) * 10;
    if (users?.users && users.page > 1 && users.users.length == count) {
      getAllUsers();
    }
  }, [users.page]);

  /* Handle search for users by pressing enter*/
  const handleSearchByEnterKey = (e: any) => {
    e.key == "Enter" && handleSearch();
  };

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
      {(deleteUserLoading ||
        logoutLoading ||
        filteredUsersLoading ||
        (filteredUsers?.users && loading)) && <Loading />}
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
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
        <FaSearch className="search-icon" onClick={handleSearch} />
      </div>
      {users?.users &&
        users.users.map((item: any, index: number) => {
          return (
            <UserDetails
              handleShowUserChat={handleShowUserChat}
              key={index}
              item={item}
            />
          );
        })}

      {data?.users &&
        users?.users &&
        users.users.length >= 10 &&
        data?.users.length < data?.total &&
        !loading && (
          <Stack>
            <IoIosArrowDropdownCircle
              onClick={handleIncreasePage}
              size={40}
              className="show-more-users-icon"
            />
          </Stack>
        )}
      {loading && !filteredUsers?.users && (
        <CircularProgress color="info" className="circle-progress-loading" />
      )}
      <Footer />
    </div>
  );
};

export default Users;
