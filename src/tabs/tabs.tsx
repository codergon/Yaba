import "./tabs.scss";
import React from "react";
import Home from "./components/Home";
import Settings from "./components/Settings";
import { Routes, Route } from "react-router-dom";

function Tabs() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default Tabs;
