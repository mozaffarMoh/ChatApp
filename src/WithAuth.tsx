import { useEffect, useState } from "react";
import { Loading } from "./components";
import baseApi from "./api/baseApi";
import { endPoint } from "./api/endPoint";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const withAuth = (Component: React.FC<any>) => {
  const WithAuthComponent: any = (props: any) => {
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      if (token) {
        baseApi
          .post(endPoint.checkToken, { token: token })
          .then(() => {
            setIsAuthenticated(true);
          })
          .catch(() => {
            setIsAuthenticated(false);
          });
      } else {
        setIsAuthenticated(false);
      }
    }, [token]);

    if (isAuthenticated === null) {
      return <Loading />;
    }

    const handleLeave = () => {
      Cookies.remove("token");
      Cookies.remove("userId");
      navigate("/start-page");
    };

    return isAuthenticated ? <Component {...props} /> : handleLeave();
  };

  return WithAuthComponent;
};

export default withAuth;
