import { Button } from "@mui/material";
import "./StartPage.scss";
import { useNavigate } from "react-router-dom";
import startImage from "../../assets/images/start-page.png";
import React from "react";

const StartPage = () => {
  const navigate = useNavigate();
  let speed = 60;
  let text =
    "  Chat helps Workspace users connect and collaborate to get things done.";
  const [displayedText, setDisplayedText] = React.useState("");

  React.useEffect(() => {
    if (displayedText.length !== text.length - 1) {
      let index = 0;
      const intervalId = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        index += 1;
        if (index >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }
  }, [text]);
  return (
    <div className="start-page flexCenter">
      <div className="action-section flexBetweenColumnItemsStart">
        <div className="text-section">
          <h1>Welcome to ChatApp!</h1>
          <h2>Messaging and team collaboration</h2>
        </div>
        <div className="description-section">
          <p>{displayedText}</p>
        </div>
        <div className="buttons-section flexStart">
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/sign-up")}
          >
            SIGN-UP
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
      <div className="image-section">
        <img src={startImage} />
      </div>
    </div>
  );
};

export default StartPage;
