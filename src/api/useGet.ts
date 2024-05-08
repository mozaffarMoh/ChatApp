import React from "react";
import baseApi from "./baseApi";

const useGet = (endPoint: string) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => {
        setLoading(true)
        baseApi.get(endPoint).then((res) => {
            setLoading(false)
            setData(res.data)
        }).catch((err) => {
            setLoading(false);
            setErrorMessage(err.data.data)
        })
    }, [])
    return [data, loading, errorMessage, setData]
}

export default useGet;