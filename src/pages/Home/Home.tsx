import "./Home.scss";
import { ChatSection, Users } from "../../components";
import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = React.useState<boolean>(false);
  const [showUserChat, setShowUserChat] = React.useState<boolean>(false);
  const token = Cookies.get("token");
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 700);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (!token) {
      navigate("/start-page");
    }
  }, [token, navigate]);

  return token ? (
    <div className="home flexCenter">
  
      {!showUserChat && (
        <Users
          isSmallScreen={isSmallScreen}
          setShowUserChat={setShowUserChat}
        />
      )}
      <ChatSection
        showUserChat={showUserChat}
        setShowUserChat={setShowUserChat}
        isSmallScreen={isSmallScreen}
      />
    </div>
  ) : (
    <></>
  );
};

export default Home;
