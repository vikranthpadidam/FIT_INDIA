import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import "./styles/styles.css";
import AdminLogin from "./components/AdminLogin";
import StudentLogin from "./components/StudentLogin";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import MyRequests from "./components/MyRequests";
// index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import ItemsRequest from "./components/ItemsRequest";


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin_login" element={<AdminLogin />} />
      <Route path="/student_login" element={<StudentLogin />} />
      <Route path="/admin_dashboard" element={<AdminDashboard />} />
      <Route path="/student_dashboard" element={<StudentDashboard />} />
      <Route path="/my_requests/:userId" element={<MyRequests />} />
      <Route path="/items_request" element={<ItemsRequest />} />
    </Routes>
  </Router>
);

export default App;
