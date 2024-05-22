
import React from "react";
import baseApi from "../api/baseApi";

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
            if (err?.message && err?.message == "Network Error") {
                setErrorMessage("Server cannot response, check internet connection");
            }
            if (err?.response?.data) {
                setErrorMessage(err.response.data);

                setTimeout(() => {
                    setErrorMessage("")
                }, 4000);
            }
            if (err?.response?.status == 500) {
                setErrorMessage("Server cannot response, check internet connection");
            }
        })
    }




    return [putData, loading, success, errorMessage]
}

export default usePut;