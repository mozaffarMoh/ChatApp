import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Login, Register, StartPage } from "./pages";

function App() {
  return (
    <Router basename="/ChatApp">
      <Routes>
        <Route element={<Home />} path={"/"} />
        <Route element={<StartPage />} path={"/start-page"} />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
      </Routes>
    </Router>
  );
}

export default App;
