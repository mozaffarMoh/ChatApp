import React from "react";
import baseApi from "../api/baseApi";
import { UsePut } from "../Types/CustomHooks";
import notAuth from "../Auth/notAuth";

const usePut = (endPoint: string, body: any): UsePut => {
    const notAuthenticated = notAuth();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const putData = () => {
        setErrorMessage("");
        setLoading(true);
        setSuccess(false);
        baseApi
            .put(endPoint, body)
            .then(() => {
                setLoading(false);
                setSuccess(true);
            })
            .catch((err) => {
                setLoading(false);
                const message = err.response?.data?.message;
                if (!err.response) {
                    setErrorMessage("Network error: Please check your internet connection.");
                } else if (message === "Token is blacklisted" || message === "Token has expired" || message === "Invalid token") {
                    notAuthenticated()
                } else if (err?.message && err?.message === "Network Error") {
                    setErrorMessage("Server cannot respond, check internet connection");
                } else if (err?.response?.status === 500) {
                    setErrorMessage("Server cannot respond, check internet connection");
                } else if (err?.response?.data) {
                    setErrorMessage(err.response.data);
                }
                setTimeout(() => {
                    errorMessage && setErrorMessage("");
                }, 4000);
            });
    };

    return [putData, loading, success, errorMessage];
};

export default usePut;
