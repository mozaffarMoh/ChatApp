
import React from "react";
import baseApi from "./baseApi";

const usePut = (endPoint: string, body: any) => {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const putData = () => {
        setErrorMessage("")
        setLoading(true)
        setSuccess(false)
        baseApi.put(endPoint, body).then(() => {
            setLoading(false)
            setSuccess(true);
        }).catch((err: any) => {
            setLoading(false);

            if (err?.response?.data) {
                setErrorMessage(err.response.data);

                setTimeout(() => {
                    setErrorMessage("")
                }, 4000);
            }
        })
    }




    return [putData, loading, success, errorMessage]
}

export default usePut;