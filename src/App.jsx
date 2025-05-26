import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SlideBar from "./pages/SlideBar";
import Home from "./pages/Home";
import Monthly_schedule from "./pages/Monthly_schedule";
import Cleaning_Office from "./pages/Cleaning_Office";

const router = createBrowserRouter([
  {
    // layout route — no `path`, renders SlideBar for all children
    element: <SlideBar />,
    children: [
      { index: true, element: <Home /> }, // path: "/"
      { path: "cleaning-Office", element: <Cleaning_Office /> },
      { path: "monthly-schedule", element: <Monthly_schedule /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
