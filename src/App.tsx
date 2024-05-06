import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { Home, Login, Register } from "./pages";

function App() {
  return (
    <Router basename="/ChatApp">
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
      </Routes>
    </Router>
  );
}

export default App;
