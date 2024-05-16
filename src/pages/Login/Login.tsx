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

const Login = () => {
  const [inputFormData, handleChangeInputData]: any = useInput();
  const [isPasswordVisible, setIsPasswordVisible]: any = React.useState(false);
  const [handleLoginPost, loading, success, errorMessage]: any = usePost(
    endPoint.login,
    inputFormData
  );
  const loginSuccess = () => toast("Login successful. Welcome!");
  const loginFail = () => toast(errorMessage);

  const inputArray = [
    { placeholder: "Email", name: "email", type: "email" },
    {
      placeholder: "Password",
      name: "password",
      type: isPasswordVisible ? "text" : "password",
    },
  ];

  const handleLogin = (e: any) => {
    e.preventDefault();
    handleLoginPost();
  };

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
      <form className="login-field flexCenterColumn" onSubmit={handleLogin}>
        <h1>Login</h1>
        {inputArray.map((item: any, index: number) => {
          return (
            <div className="input-fields">
              <input
                required
                key={index}
                placeholder={item.placeholder}
                name={item.name}
                type={item.type}
                onChange={(e: any) => handleChangeInputData(e.target)}
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
        })}
        <Button type="submit" variant="contained" color="info">
          Login
        </Button>
        <Link to={"/sign-up"}>Create account</Link>
      </form>
    </div>
  );
};

export default Login;
