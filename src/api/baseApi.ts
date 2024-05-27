import axios from "axios";
import Cookies from 'js-cookie';

const baseApi = axios.create({
    baseURL: "https://test-node-js-ze6q.onrender.com",
    headers: {
        "Content-Type": "application/json",
    }, 
});

//https://test-node-js-ze6q.onrender.com
//http://localhost:8080

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