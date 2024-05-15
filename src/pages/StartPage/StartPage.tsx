import { Button } from "@mui/material";
import "./StartPage.scss";
import { useNavigate } from "react-router-dom";
import startImage from "../../assets/images/start-page.png";

const StartPage = () => {
  const navigate = useNavigate();
  return (
    <div className="start-page flexCenter">
      <div className="action-section flexBetweenColumnItemsStart">
        <div className="text-section">
          <h1>Welcome to ChatApp!</h1>
          <h2>Messaging and team collaboration</h2>
        </div>
        <div className="description-section">
          <p>
            Chat helps Workspace users connect and collaborate to get things
            done.
          </p>
        </div>
        <div className="buttons-section flexStart">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/register")}
          >
            Sign-UP
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
