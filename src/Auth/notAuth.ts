import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useMessagesCache } from "../Context/MessagesContext";
import { useUserDetails } from "../Context/UserDetailsProvider";
import { useUsersContext } from "../Context/UsersProvider";
import { useDispatch } from "react-redux";
import { setReceiverId } from "../Slices/receiverIdSlice";


const notAuth = () => {
    const navigate = useNavigate();
    const { messagesCache, setMessagesCache }: any = useMessagesCache();
    const { users, setUsers }: any = useUsersContext();
    const { userDetails, setUserDetails }: any = useUserDetails();
    const token = Cookies.get("token")
    const dispatch = useDispatch()

    const notAuthenticated = () => {
        dispatch(setReceiverId(""))
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