import { Button } from "@mui/material";
import "./Register.scss";
import { Link } from "react-router-dom";
import { Loading } from "../../components";
import { ToastContainer, toast } from "react-toastify";
import React from "react";
import usePost from "../../api/usePost";
import useInput from "../../api/useInput";
import { endPoint } from "../../api/endPoint";

const Register = () => {
  const [inputFormData, handleChangeInputData]: any = useInput();
  const [handleRegisterPost, loading, success, errorMessage]: any = usePost(
    endPoint.register,
    inputFormData
  );
  const loginSuccess = () => toast("Account has been successfully created");
  const loginFail = () => toast(errorMessage);

  const inputArray = [
    { placeholder: "Email", name: "email", type: "email" },
    { placeholder: "Username", name: "username", type: "text" },
    { placeholder: "Password", name: "password", type: "password" },
  ];

  const handleRegister = (e: any) => {
    e.preventDefault();
    handleRegisterPost();
  };

  React.useEffect(() => {
    if (!loading) {
      success && loginSuccess();
      errorMessage && loginFail();
    }
  }, [success, errorMessage]);

  return (
    <div className="register flexCenter">
      {loading && <Loading />}
      <ToastContainer />
      <form
        className="register-field flexCenterColumn"
        onSubmit={handleRegister}
      >
        <h1>SIGN-UP</h1>
        {inputArray.map((item: any, index: number) => {
          return (
            <input
              required
              key={index}
              placeholder={item.placeholder}
              name={item.name}
              type={item.type}
              onChange={(e: any) => handleChangeInputData(e.target)}
            />
          );
        })}
        <Button type="submit" variant="contained" color="info">
          Create account
        </Button>
        <Link to={"/login"}>Login</Link>
      </form>
    </div>
  );
};

export default Register;
