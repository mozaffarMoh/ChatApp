import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Login, Register } from "./pages";
import Cookies from "js-cookie";

function App() {
  const token = Cookies.get("token");

  return (
    <Router basename="/ChatApp">
      <Routes>
        <Route element={token ? <Home /> : <Login />} path={"/"} />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
      </Routes>
    </Router>
  );
}

export default App;
