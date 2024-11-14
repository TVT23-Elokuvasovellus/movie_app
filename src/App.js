import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GroupCreator from "./components/groupCreator";
import GroupPage from "./screens/groupPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupCreator />} />
        <Route path="/group/:id" element={<GroupPage  />} />
      </Routes>
    </Router>
  );
}

export default App;
