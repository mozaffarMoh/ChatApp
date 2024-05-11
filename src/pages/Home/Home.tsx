import "./Home.scss";
import { ChatSection, Users } from "../../components";
import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [showUserChat, setShowUserChat] = React.useState(false);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (window.innerWidth <= 700) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }, []);

  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return token ? (
    <div className="home flexCenter">
      {!showUserChat && (
        <Users
          isSmallScreen={isSmallScreen}
          setShowUserChat={setShowUserChat}
        />
      )}
      {(!isSmallScreen || (isSmallScreen && showUserChat)) && (
        <ChatSection
          setShowUserChat={setShowUserChat}
          isSmallScreen={isSmallScreen}
        />
      )}
    </div>
  ) : (
    <></>
  );
};

export default Home;
