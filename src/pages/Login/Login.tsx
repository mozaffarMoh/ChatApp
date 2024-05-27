import { Button } from "@mui/material";
import "./Login.scss";
import { Link } from "react-router-dom";
import { Loading } from "../../components";
import { toast } from "react-toastify";
import React from "react";
import { endPoint } from "../../api/endPoint";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useInput, usePost } from "../../Custom-Hooks";
import { LoginFormData } from "../../Types/Auth";

const Login: React.FC = () => {
  const [inputFormData, handleChangeInputData, setInputFormData] = useInput();
  const [isPasswordVisible, setIsPasswordVisible] =
    React.useState<boolean>(false);
  const [isStartEnterKey, setStartEnterKey] = React.useState<boolean>(false);
  const [handleLoginPost, loading, success, errorMessage] = usePost(
    endPoint.login,
    inputFormData
  );

  let {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  }: any = useForm<LoginFormData>();
  const loginSuccess = () => toast("Login successful. Welcome!");
  const loginFail = () => toast(errorMessage);

  const inputArray = [
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
      if (success) {
        setInputFormData({});
        loginSuccess();
      }
      errorMessage && loginFail();
    }
  }, [success, errorMessage]);

  return (
    <div className="login flexCenter">
      {loading && <Loading />}
      <form
        className="login-field flexCenterColumn"
        onSubmit={handleSubmit(handleLogin)}
      >
        <h1>Login</h1>
        {inputArray.map((item: any, index: number) => {
          return (
            <div className="input-fields" key={index}>
              <input
                placeholder={item.placeholder}
                name={item.name}
                type={item.type}
                value={item?.value}
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
