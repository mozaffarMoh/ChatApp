import "./Home.scss";
import { ChatSection, Users } from "../../components";
import React from "react";
import withAuth from "../../WithAuth";
import { useMediaQuery } from "@mui/material";

const Home: React.FC = () => {
  const [showUserChat, setShowUserChat] = React.useState<boolean>(false);
  const isSmallScreen = useMediaQuery("(max-width:700px)");

  React.useEffect(() => {
    !isSmallScreen && setShowUserChat(false);
  }, [isSmallScreen]);
  
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
