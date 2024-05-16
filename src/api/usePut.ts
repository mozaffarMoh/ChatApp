
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
            console.log(err?.response?.data?.error);

            if (err?.request && !err?.response?.data?.error) {
                setErrorMessage('Error in upload : check Image size it should be 70KB or less');
            }

            if (err?.response?.data?.error) {
                setErrorMessage(err.response.data.error);
            }

            setTimeout(() => {
                setErrorMessage("")
            }, 4000);
        })
    }




    return [putData, loading, success, errorMessage]
}

export default usePut;