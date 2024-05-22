import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import baseApi from "../api/baseApi";

const useGet = (endPoint: string) => {
    const navigate = useNavigate()
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const getData = () => {
        setSuccess(false)
        setLoading(true)
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
    return [data, loading, getData, success, errorMessage, setData]
}

export default useGet;