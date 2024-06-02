import { useEffect, useState } from "react";
import { Loading } from "../components";
import baseApi from "../api/baseApi";
import { endPoint } from "../api/endPoint";
import Cookies from "js-cookie";
import notAuth from "./notAuth";
const withAuth = (Component: React.FC<any>) => {
  const WithAuthComponent: React.FC<any> = (props: any) => {
    const notAuthenticated = notAuth();
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

    useEffect(() => {
      if (isAuthenticated === false) {
        notAuthenticated();
      }
    }, [isAuthenticated]);

    if (isAuthenticated === null) {
      return <Loading />;
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };

  return WithAuthComponent;
};

export default withAuth;
