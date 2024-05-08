import { CircularProgress } from "@mui/material";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className="loading flexCenterColumn">
      <CircularProgress className="loading-circle" />
    </div>
  );
};

export default Loading;
