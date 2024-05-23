import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import baseApi from "../api/baseApi";
import { UsePost } from "../Types/CustomHooks";



const usePost = <T,>(endPoint: string, body: object): UsePost<T> => {
    const navigate = useNavigate();
    const [data, setData] = React.useState<T>({} as T);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [success, setSuccess] = React.useState<boolean>(false);

    const handlePost = () => {
        setLoading(true);
        setSuccess(false);
        baseApi
            .post(endPoint, body)
            .then((res) => {
                setLoading(false);
                setData(res.data);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
                if (
                    location.pathname.includes("login") ||
                    location.pathname.includes("sign-up")
                ) {
                    setTimeout(() => {
                        setSuccess(false);
                        Cookies.set("token", res.data.token);
                        Cookies.set("userId", res.data.userId);
                        navigate("/");
                    }, 3000);
                }
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
                    setErrorMessage(err.response.data);

                    setTimeout(() => {
                        setErrorMessage("");
                    }, 4000);
                }
            });
    };

    return [handlePost, loading, success, errorMessage, data];
};

export default usePost;
