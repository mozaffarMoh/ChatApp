import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-h5-audio-player/lib/styles.css";
import { Provider } from "react-redux";
import store from "./store.ts";
import { ToastContainer } from "react-toastify";
import { MessagesCacheProvider } from "./Context/MessagesContext.tsx";
import { UserDetailsProvider } from "./Context/UserDetailsProvider.tsx";
import { UsersProvider } from "./Context/UsersProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ToastContainer />
    <UsersProvider>
      <UserDetailsProvider>
        <MessagesCacheProvider>
          <App />
        </MessagesCacheProvider>
      </UserDetailsProvider>
    </UsersProvider>
  </Provider>
);
