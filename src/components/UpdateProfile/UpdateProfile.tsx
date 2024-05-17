import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { endPoint } from "../../api/endPoint";
import usePut from "../../api/usePut";
import "./UpdateProfile.scss";
import React from "react";
import useInput from "../../api/useInput";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../Loading/Loading";
import Base64 from "../../assets/constants/Base64";
import { useDispatch } from "react-redux";
import { setRefreshUsers } from "../../Slices/refreshUsers";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";

const UpdateProfile = ({ myData, setShowUpdateProfile, userId }: any) => {
  const dispatch = useDispatch();
  const [imgFile, setImgFile]: any = React.useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible]: any =
    React.useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible]: any =
    React.useState(false);
  const [inputFormData, handleChangeInputData, setInputFormData]: any =
    useInput();
  const [handleUpdateProfile, loading, success, errorMessage]: any = usePut(
    endPoint.updateProfilePhoto + "/" + userId,
    inputFormData
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  }: any = useForm();

  const inputArray = [
    {
      placeholder: "Username",
      name: "username",
      type: "text",
      value: inputFormData?.username,
      validation: {
        ...register("username", {
          required: "Username required",
        }),
      },
    },
    {
      placeholder: "Old password",
      name: "oldPassword",
      type: isOldPasswordVisible ? "text" : "password",
      validation: inputFormData?.newPassword && {
        ...register("oldPassword", {
          required: "Old password required !!",
          minLength: {
            value: 5,
            message: "Old password must contain at least 5 values",
          },
        }),
      },
    },
    {
      placeholder: "New password",
      name: "newPassword",
      type: isNewPasswordVisible ? "text" : "password",
      validation: inputFormData?.oldPassword && {
        ...register("newPassword", {
          required: "New password required !!",
          minLength: {
            value: 5,
            message: "New password must contain at least 5 values",
          },
        }),
      },
    },
  ];

  /* Message for success or fail */
  const updateSuccessMessage = () =>
    toast("Updated profile has been successfuly");
  const updateFailMessage = () => toast(errorMessage);

  /* set intiatl values to input form */
  React.useEffect(() => {
    if (inputFormData?.username == undefined) {
      setInputFormData({
        username: myData?.username,
        profilePhoto: myData?.profilePhoto,
        oldPassword: "",
        newPassword: "",
      });
    }
  }, []);

  /* Start update profile */
  const handleUpdate = () => {
    handleUpdateProfile();
  };

  /* show message if success or fail */
  React.useEffect(() => {
    if (!loading) {
      if (success) {
        updateSuccessMessage();
        dispatch(setRefreshUsers(true));
        setTimeout(() => {
          setShowUpdateProfile(false);
        }, 2000);
      }
      errorMessage && updateFailMessage();
    }
  }, [success, errorMessage]);

  /* Select new image */
  const handleImage = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await Base64(file);
    setImgFile(base64);
  };

  /* Add image to form when filled */
  React.useEffect(() => {
    imgFile && setInputFormData({ ...inputFormData, profilePhoto: imgFile });
  }, [imgFile]);

  /* Remove Current photo */
  const handleRemovePhoto = () => {
    setImgFile("");
    setInputFormData({ ...inputFormData, profilePhoto: "" });
  };

  const handleClickShowPassword = (name: any) => {
    if (name == "newPassword") {
      setIsNewPasswordVisible(!isNewPasswordVisible);
    } else if (name == "oldPassword") {
      setIsOldPasswordVisible(!isOldPasswordVisible);
    }
  };

  return (
    <div className="update-profile flexCenterColumn">
      {loading && <Loading />}
      <h1>Update profile</h1>
      <ToastContainer />
      <div className="profile-image-section">
        {!imgFile && (
          <label className="upload-photo flexCenter " htmlFor="select-image-id">
            <input
              type="file"
              id="select-image-id"
              hidden
              onChange={handleImage}
            />
            <p>Upload Photo</p>
          </label>
        )}
        {!inputFormData?.profilePhoto ? (
          <Avatar className="avatar-section" />
        ) : (
          <img src={inputFormData?.profilePhoto} alt="" />
        )}
      </div>
      <Button variant="outlined" color="error" onClick={handleRemovePhoto}>
        Remove Photo
      </Button>
      <form
        className="update-profile-field flexCenterColumn"
        onSubmit={handleSubmit(handleUpdate)}
      >
        {inputArray.map((item: any, index: number) => {
          return (
            <TextField
              key={index}
              placeholder={item.placeholder}
              name={item.name}
              type={item.type}
              value={item?.value}
              {...item?.validation}
              onChange={(e: any) => handleChangeInputData(e.target)}
              InputProps={{
                endAdornment: item?.name !== "username" && (
                  <InputAdornment position="end" className="show-password">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword(item?.name)}
                    >
                      {(isOldPasswordVisible && item?.name == "oldPassword") ||
                      (isNewPasswordVisible && item?.name == "newPassword") ? (
                        <IoMdEye />
                      ) : (
                        <IoMdEyeOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          );
        })}
        {(errors.username || errors.oldPassword || errors.newPassword) && (
          <div className="error-message-validation-profile">
            {errors.username?.message ||
              errors.oldPassword?.message ||
              errors.newPassword?.message}
          </div>
        )}{" "}
        <div className="buttons-field flexBetween ">
          <Button type="submit" variant="contained" color="info">
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowUpdateProfile(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
