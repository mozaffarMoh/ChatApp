import React from "react";
import baseApi from "../api/baseApi";
import { UseGet } from "../Types/CustomHooks";
import notAuth from "../Auth/notAuth";

const useGet = (endPoint: string): UseGet<any> => {
    const notAuthenticated = notAuth();
    const [data, setData] = React.useState<any>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const getData = () => {
        setSuccess(false);
        setLoading(true);
        baseApi
            .get(endPoint)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setData(res.data);
                if (endPoint.includes("logout")) {
                    notAuthenticated()
                }
            })
            .catch((err: any) => {
                setLoading(false)
                const message = err.response?.data?.message;
                if (message === "Token is blacklisted" || message === "Token has expired" || message === "Invalid token") {
                    notAuthenticated()
                }
                setLoading(false);
                setErrorMessage(err.response.data);
            });
    };

    React.useEffect(() => {
        if (!endPoint.includes("logout") && !endPoint.includes("messages") && !endPoint.includes("one-user")) {
            getData();
        }
    }, [endPoint]);

    return [data, loading, getData, success, errorMessage, setData];
};

export default useGet;
