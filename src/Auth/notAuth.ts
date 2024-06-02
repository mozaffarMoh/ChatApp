import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useMessagesCache } from "../Context/MessagesContext";
import { useUserDetails } from "../Context/UserDetailsProvider";


const notAuth = () => {
    const navigate = useNavigate();
    const { messagesCache, setMessagesCache }: any = useMessagesCache();
    const { userDetails, setUserDetails }: any = useUserDetails();
    const token = Cookies.get("token")

    const notAuthenticated = () => {
        messagesCache && setMessagesCache({});
        userDetails && setUserDetails({});
        Cookies.remove("token");
        Cookies.remove("userId");
        navigate(!token ? "start-page" : "/login");
    }

    return notAuthenticated
}

export default notAuth;