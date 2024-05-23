import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import baseApi from "../api/baseApi";
import { UseDelete } from "../Types/CustomHooks";


const useDelete = (endPoint: string): UseDelete => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [successMessage, setSuccessMessage] = React.useState<string>("");

    const handleDelete = () => {
        setLoading(true);
        baseApi
            .delete(endPoint)
            .then(() => {
                setLoading(false);
                setSuccessMessage("Delete account has been successful")
                setTimeout(() => {
                    Cookies.remove("token");
                    Cookies.remove("userId");
                    navigate("/login");
                }, 4000);
            })
            .catch((err) => {
                setLoading(false);
                if (err?.message && err?.message === "Network Error") {
                    setErrorMessage("Server cannot respond, check internet connection");
                }

                if (err?.response?.status === 500) {
                    setErrorMessage("Server cannot respond, check internet connection");
                }

                if (err?.response?.data) {
                    setErrorMessage(err.response.data.error);

                    setTimeout(() => {
                        setErrorMessage("");
                    }, 4000);
                }

                console.log(err);

            });
    };

    return [handleDelete, loading, errorMessage, successMessage];
};

export default useDelete;
