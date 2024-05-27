import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store.ts";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ToastContainer />
    <App />
  </Provider>
);
