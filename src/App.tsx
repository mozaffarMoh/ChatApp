import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Login, Register, StartPage } from "./pages";

const App: React.FC = () => {
  return (
    <Router basename="/ChatApp">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start-page" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
