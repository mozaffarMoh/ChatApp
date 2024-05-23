import React from "react";
import baseApi from "../api/baseApi";
import { UsePut } from "../Types/CustomHooks";

const usePut = (endPoint: string, body: any): UsePut => {
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
                if (err?.message && err?.message === "Network Error") {
                    setErrorMessage("Server cannot respond, check internet connection");
                }
                if (err?.response?.data) {
                    setErrorMessage(err.response.data);

                    setTimeout(() => {
                        setErrorMessage("");
                    }, 4000);
                }
                if (err?.response?.status === 500) {
                    setErrorMessage("Server cannot respond, check internet connection");
                }
            });
    };

    return [putData, loading, success, errorMessage];
};

export default usePut;
