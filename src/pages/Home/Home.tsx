import "./Home.scss";
import { ChatSection, Users } from "../../components";
import React from "react";
import withAuth from "../../WithAuth";

const Home: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = React.useState<boolean>(false);
  const [showUserChat, setShowUserChat] = React.useState<boolean>(false);


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

  return (
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
  );
};

export default withAuth(Home);
