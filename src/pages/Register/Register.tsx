import { Avatar, Button } from "@mui/material";
import "./Register.scss";
import { Link } from "react-router-dom";
import { Loading } from "../../components";
import { ToastContainer, toast } from "react-toastify";
import React from "react";
import usePost from "../../api/usePost";
import useInput from "../../api/useInput";
import { endPoint } from "../../api/endPoint";
import Base64 from "../../assets/constants/Base64";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";

const Register = () => {
  const [inputFormData, handleChangeInputData, setInputFormData]: any =
    useInput();
  const [imgFile, setImgFile]: any = React.useState("");
  const [isPasswordVisible, setIsPasswordVisible]: any = React.useState(false);
  const [handleRegisterPost, loading, success, errorMessage]: any = usePost(
    endPoint.register,
    inputFormData
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  }: any = useForm();
  const loginSuccess = () => toast("Account has been successfully created");
  const loginFail = () => toast(errorMessage);

  const inputArray = [
    {
      placeholder: "Username",
      name: "username",
      type: "text",
      validation: {
        ...register("username", {
          required: "Username required!!",
        }),
      },
    },
    {
      placeholder: "Email",
      name: "email",
      type: "text",
      validation: {
        ...register("email", {
          required: "Email required!!",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please enter a valid email address!!",
          },
        }),
      },
    },
    {
      placeholder: "Password",
      name: "password",
      type: isPasswordVisible ? "text" : "password",
      validation: {
        ...register("password", {
          required: "Password required!!",
          minLength: {
            value: 5,
            message: "Password must contain at least 5 values!!",
          },
        }),
      },
    },
  ];

  const handleRegister = () => {
    handleRegisterPost();
  };

  const disableEnterKey = (e: any) => {
    if (e.key == "Enter") {
      e.preventDefault();
    }
  };

  React.useEffect(() => {
    if (!loading) {
      success && loginSuccess();
      errorMessage && loginFail();
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

  return (
    <div className="register flexCenter">
      {loading && <Loading />}
      <ToastContainer />
      <form
        className="register-field flexCenterColumn"
        onSubmit={handleSubmit(handleRegister)}
      >
        <h1>SIGN-UP</h1>
        <div className="profile-image-section">
          <label className="upload-photo flexCenter " htmlFor="select-image-id">
            <input
              type="file"
              id="select-image-id"
              hidden
              onChange={handleImage}
            />
            <p>{inputFormData?.profilePhoto ? "Update" : "Upload"} Photo</p>
          </label>
          {!inputFormData?.profilePhoto ? (
            <Avatar className="avatar-section" />
          ) : (
            <img src={inputFormData?.profilePhoto} alt="" />
          )}{" "}
        </div>
        {inputFormData?.profilePhoto && (
          <Button variant="outlined" color="error" onClick={handleRemovePhoto}>
            Remove Photo
          </Button>
        )}
        {inputArray.map((item: any, index: number) => {
          return (
            <div className="input-fields">
              <input
                key={index}
                placeholder={item.placeholder}
                name={item.name}
                type={item.type}
                {...item?.validation}
                onChange={(e: any) => handleChangeInputData(e.target)}
                onKeyDown={disableEnterKey}
              />
              {item?.name == "password" && (
                <div
                  className="show-passord-control flexCenter"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <IoMdEye size={30} color="#3543be" />
                  ) : (
                    <IoMdEyeOff size={30} color="#3543be" />
                  )}
                </div>
              )}{" "}
            </div>
          );
        })}{" "}
        {(errors.username || errors.email || errors.password) && (
          <div className="error-message-validation">
            {errors.username?.message ||
              errors.email?.message ||
              errors.password?.message}
          </div>
        )}
        <Button
          type="submit"
          variant="contained"
          color="info"
          className="register-button"
        >
          Create account
        </Button>
        <Link to={"/login"}>Login</Link>
      </form>
    </div>
  );
};

export default Register;
