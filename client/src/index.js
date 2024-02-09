// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
//import HomePage from "./components/HomePage";
// index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* <HomePage/> */}
    <App />
  </React.StrictMode>
);
