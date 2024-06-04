import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useMessagesCache } from "../Context/MessagesContext";
import { useUserDetails } from "../Context/UserDetailsProvider";
import { useUsersContext } from "../Context/UsersProvider";


const notAuth = () => {
    const navigate = useNavigate();
    const { messagesCache, setMessagesCache }: any = useMessagesCache();
    const { users, setUsers }: any = useUsersContext();
    const { userDetails, setUserDetails }: any = useUserDetails();
    const token = Cookies.get("token")

    const notAuthenticated = () => {
        messagesCache && setMessagesCache({});
        userDetails && setUserDetails({});
        users && setUsers({ users: [], page: 1 })
        Cookies.remove("token");
        Cookies.remove("userId");
        navigate(!token ? "start-page" : "/login");
    }

    return notAuthenticated
}

export default notAuth;