import axios from "axios";
import Cookies from 'js-cookie';

const baseApi = axios.create({
    baseURL: "https://chatappapi-2w5v.onrender.com",
    headers: {
        "Content-Type": "application/json",
    }, 
});

//http://localhost:8080
//https://chatappapi-2w5v.onrender.com

baseApi.interceptors.request.use(
    (config: any) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);



export default baseApi