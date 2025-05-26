import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cleaning_Office from "./pages/Cleaning_Office.jsx";
import Home from "./pages/Home.jsx";
import Monthly_schedule from "./pages/Monthly_schedule.jsx";
import SlideBar from "./pages/SlideBar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
