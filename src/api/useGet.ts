import React from "react";
import baseApi from "./baseApi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useGet = (endPoint: string) => {
    const navigate = useNavigate()
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const getData = () => {
        setSuccess(false)
        setLoading(true)
        setData([])
        baseApi.get(endPoint).then((res) => {
            setSuccess(true)
            setLoading(false)
            setData(res.data)
        }).catch((err: any) => {
            const message = err.response.data;

            if (message == "Forbidden" || message == "Unauthorized") {
                Cookies.remove('token');
                Cookies.remove('userId');
                navigate('/login');
            }
            setLoading(false);
            setErrorMessage(err.response.data)
        })

    }
    React.useEffect(() => {
        getData()
    }, [])
    return [data, loading, getData, success, errorMessage]
}

export default useGet;