import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import baseApi from "../api/baseApi";
import { UseGet } from "../Types/CustomHooks";


const useGet = (endPoint: string): UseGet<any> => {
    const navigate = useNavigate();
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
                    Cookies.remove("token");
                    Cookies.remove("userId");
                    navigate("/login");
                }
            })
            .catch((err: any) => {
                setLoading(false)
                const message = err.response.data;
                if (message === "Forbidden" || message === "Unauthorized") {
                    Cookies.remove("token");
                    Cookies.remove("userId");
                    navigate("/login");
                }
                setLoading(false);
                setErrorMessage(err.response.data);
            });
    };

    React.useEffect(() => {
        if (!endPoint.includes("logout") && !endPoint.includes("page") && !endPoint.includes("one-user")) {
            getData();
        }
    }, [endPoint]);

    return [data, loading, getData, success, errorMessage, setData];
};

export default useGet;
