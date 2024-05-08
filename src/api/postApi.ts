import axios from "axios";
import Cookies from 'js-cookie';

const postApi = axios.create({
    baseURL: "https://travelde.pythonanywhere.com/travelapp",
    headers: {
        "Content-Type": "application/json",
    },
});


postApi.interceptors.request.use(
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



export default postApi