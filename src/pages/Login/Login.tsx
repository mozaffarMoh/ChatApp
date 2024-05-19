import { Button } from "@mui/material";
import "./Login.scss";
import { Link } from "react-router-dom";
import { Loading } from "../../components";
import { ToastContainer, toast } from "react-toastify";
import React from "react";
import usePost from "../../api/usePost";
import useInput from "../../api/useInput";
import { endPoint } from "../../api/endPoint";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";

const Login = () => {
  const [inputFormData, handleChangeInputData]: any = useInput();
  const [isPasswordVisible, setIsPasswordVisible]: any = React.useState(false);
  const [isStartEnterKey, setStartEnterKey]: any = React.useState(false);
  const [handleLoginPost, loading, success, errorMessage]: any = usePost(
    endPoint.login,
    inputFormData
  );
  let {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  }: any = useForm();
  const loginSuccess = () => toast("Login successful. Welcome!");
  const loginFail = () => toast(errorMessage);

  const inputArray = [
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

  const handleLogin = () => {
    handleLoginPost();
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

  /* check login validation after enter key */
  const handleLoginEnterKey = async (e: any) => {
    if (e.key === "Enter") {
      await trigger("email");
      await trigger("password");
      focusAndBlur();
      setStartEnterKey(true);
    }
  };

  /* Start login after enter key for first enter press */
  React.useEffect(() => {
    if (isStartEnterKey) {
      handleSubmit(handleLogin)();
      focusAndBlur();
    }
  }, [isStartEnterKey]);

  React.useEffect(() => {
    if (!loading) {
      success && loginSuccess();
      errorMessage && loginFail();
    }
  }, [success, errorMessage]);

  return (
    <div className="login flexCenter">
      {loading && <Loading />}
      <ToastContainer />
      <form
        className="login-field flexCenterColumn"
        onSubmit={handleSubmit(handleLogin)}
      >
        <h1>Login</h1>
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
                onKeyDown={handleLoginEnterKey}
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
              )}
            </div>
          );
        })}{" "}
        {(errors.email || errors.password) && (
          <div className="error-message-validation">
            {errors.email?.message || errors.password?.message}
          </div>
        )}
        <Button type="submit" variant="contained" color="info">
          Login
        </Button>
        <Link to={"/sign-up"}>Create account</Link>
      </form>
    </div>
  );
};

export default Login;
