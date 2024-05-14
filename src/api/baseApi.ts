import axios from "axios";
import Cookies from 'js-cookie';

const baseApi = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
    },
});

//https://test-node-js-ze6q.onrender.com
//http://localhost:4000

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