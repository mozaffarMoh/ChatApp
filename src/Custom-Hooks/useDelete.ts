import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import baseApi from "../api/baseApi";
import { UseDelete } from "../Types/CustomHooks";
import notAuth from "../Auth/notAuth";


const useDelete = (endPoint: string): UseDelete => {
    const navigate = useNavigate();
    const notAuthenticated = notAuth();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [successMessage, setSuccessMessage] = React.useState<string>("");
    const handleDelete = () => {
        setLoading(true);
        baseApi
            .delete(endPoint)
            .then(() => {
                setLoading(false);
                setSuccessMessage("Your account has been deleted successfully.")
                setTimeout(() => {
                    if (endPoint.includes('users')) {
                        Cookies.remove("token");
                        Cookies.remove("userId");
                        navigate("/login");
                    }
                    setSuccessMessage("")
                }, 3000);
            })
            .catch((err) => {
                setLoading(false);
                const message = err.response.data.message;
                if (message === "Token is blacklisted" || message === "Token has expired" || message === "Invalid token") {
                    notAuthenticated()
                }
                if (err?.message && err?.message === "Network Error") {
                    setErrorMessage("Server cannot respond, check internet connection");
                }

                if (err?.response?.status === 500) {
                    setErrorMessage("Server cannot respond, check internet connection");
                }

                if (err?.response?.data) {
                    setErrorMessage(err.response.data.error);
                }

                setTimeout(() => {
                    setErrorMessage("");
                }, 4000);

            });
    };

    return [handleDelete, loading, errorMessage, successMessage];
};

export default useDelete;
