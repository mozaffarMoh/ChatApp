import { useEffect, useState, useRef } from "react";
import axios, { CancelTokenSource } from "axios";
import baseApi from "../api/baseApi";
import { UseGet } from "../Types/CustomHooks";
import notAuth from "../Auth/notAuth";

const useGet = (endPoint: string): UseGet<any> => {
    const notAuthenticated = notAuth();
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const cancelTokenRef = useRef<{ [key: string]: CancelTokenSource | null }>({});

    const getData = () => {
        if (cancelTokenRef.current[endPoint]) {
            cancelTokenRef.current[endPoint]!.cancel("Operation canceled by the user.");
        }
        const cancelTokenSource = axios.CancelToken.source();
        cancelTokenRef.current[endPoint] = cancelTokenSource;

        setSuccess(false);
        setLoading(true);
        baseApi
            .get(endPoint, { cancelToken: cancelTokenSource.token })
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setData(res.data);
                if (endPoint.includes("logout")) {
                    notAuthenticated();
                }
            })
            .catch((err: any) => {
                if (axios.isCancel(err)) {
                    return;
                } else {
                    setLoading(false);
                    const message = err.response?.data?.message;
                    if (!err.response) {
                        setErrorMessage("Network error: Please check your internet connection.");
                    } else if (message === "Token is blacklisted" || message === "Token has expired" || message === "Invalid token") {
                        notAuthenticated();
                    } else {
                        setErrorMessage(err.response?.data);
                    }
                }
            })
            .finally(() => {
                cancelTokenRef.current[endPoint] = null;
            });
    };

    useEffect(() => {
        if (!endPoint.includes("logout") && !endPoint.includes("messages") && !endPoint.includes("one-user")) {
            getData();
        }
        return () => {
            if (cancelTokenRef.current[endPoint]) {
                cancelTokenRef.current[endPoint]!.cancel("Operation canceled by the user.");
            }
        };
    }, [endPoint]);

    return [data, loading, getData, success, errorMessage, setData];
};

export default useGet;
