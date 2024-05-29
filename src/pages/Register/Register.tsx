import { Avatar, Button } from "@mui/material";
import "./Register.scss";
import { Link } from "react-router-dom";
import { Loading } from "../../components";
import { toast } from "react-toastify";
import React from "react";
import { useInput, usePost } from "../../Custom-Hooks";
import { endPoint } from "../../api/endPoint";
import Base64 from "../../assets/constants/Base64";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";
import { RegisterFormData } from "../../Types/Auth";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Register: React.FC = () => {
  const [inputFormData, handleChangeInputData, setInputFormData] = useInput();
  const [imgFile, setImgFile]: any = React.useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] =
    React.useState<boolean>(false);
  const [isStartEnterKey, setStartEnterKey] = React.useState<boolean>(false);
  const [handleRegisterPost, loading, success, errorMessage] = usePost(
    endPoint.register,
    inputFormData
  );
  const [gmailToken, setGmailToken] = React.useState<object | any>(null);
  const [
    handleRegisterWithGoogle,
    googleLoading,
    googleSuccess,
    ,
    ,
    googleSuccessMessage,
  ] = usePost(endPoint.registerGoogle, gmailToken);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const loginSuccess = () => toast("Account has been successfully created");
  const loginFail = () => toast(errorMessage);

  const inputArray = [
    {
      placeholder: "Username",
      name: "username",
      type: "text",
      value: inputFormData?.username || "",
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
      value: inputFormData?.email || "",
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
      value: inputFormData?.password || "",
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

  /* Focus and blur inputs to trigger validation errors */
  const focusAndBlur = () => {
    return Object.keys(errors).forEach((errorKey) => {
      const element = document.getElementsByName(errorKey)[0];
      if (element) {
        element.blur();
        element.focus();
      }
    });
  };

  /* check Register validation after enter key */
  const handleRegisterEnterKey = async (e: any) => {
    if (e.key === "Enter") {
      await trigger("email");
      await trigger("password");
      focusAndBlur();
      setStartEnterKey(true);
    }
  };

  /* Start Register after enter key for first enter press */
  React.useEffect(() => {
    if (isStartEnterKey) {
      handleSubmit(handleRegister)();
      focusAndBlur();
    }
  }, [isStartEnterKey]);

  React.useEffect(() => {
    if (!loading) {
      if (success) {
        setInputFormData({});
        loginSuccess();
      }
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

  /* GOOGLE credential */
  const handleGoogleSuccess = async (response: any) => {
    setGmailToken({
      token: response.credential,
    });
  };
  React.useEffect(() => {
    if (gmailToken) {
      handleRegisterWithGoogle();
    }
  }, [gmailToken]);
  React.useEffect(() => {
    const successGoogle = () => toast(googleSuccessMessage);
    if (googleSuccess) {
      successGoogle();
    }
  }, [googleSuccess, googleSuccessMessage]);

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId="202948221783-m98hb00hfk2d0v73bqrrev24f0ubui74.apps.googleusercontent.com">
      <div className="register flexCenter">
        {(loading || googleLoading) && <Loading />}
        <form
          className="register-field flexCenterColumn"
          onSubmit={handleSubmit(handleRegister)}
        >
          <h1>SIGN-UP</h1>
          <div className="profile-image-section">
            <label
              className="upload-photo flexCenter "
              htmlFor="select-image-id"
            >
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
              <img src={inputFormData.profilePhoto} alt="" />
            )}{" "}
          </div>
          {inputFormData?.profilePhoto && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemovePhoto}
            >
              Remove Photo
            </Button>
          )}
          {inputArray.map((item: any, index: number) => {
            return (
              <div className="input-fields" key={index}>
                <input
                  placeholder={item.placeholder}
                  name={item.name}
                  type={item.type}
                  value={item.value}
                  {...item?.validation}
                  onChange={(e: any) => handleChangeInputData(e.target)}
                  onKeyDown={handleRegisterEnterKey}
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
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
