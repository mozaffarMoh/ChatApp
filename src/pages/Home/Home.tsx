import "./Home.scss";
import { ChatSection, Users } from "../../components";
import React from "react";

const Home = () => {
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [showUserChat, setShowUserChat] = React.useState(false);

  React.useEffect(() => {
    if (window.innerWidth <= 600) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }, []);

  return (
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
  );
};

export default Home;
