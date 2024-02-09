// src/components/sLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd"; // Import Ant Design components
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai"; // Import React Icons
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "../styles/styles.css";

const StudentLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/student_login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, password }),
        }
      );

      const data = await response.json();

      console.log(data); // Log the response from the server

      if (response.ok) {
        // Store the token securely
        localStorage.setItem("token", data.token);

        // Navigate to the dashboard page
        navigate("/student_dashboard");
      } else {
        // Handle login failure (display an error message, etc.)
        console.error("Login failed:", data.error);
      }

      // You can handle success or error messages here
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-form">
        <label>
          UserId:
          <Input
            prefix={<AiOutlineUser />}
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <Input
            prefix={<AiOutlineLock />}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <Button type="primary" onClick={handleLogin}>
          Student Login
        </Button>
      </div>
    </div>
  );
};

export default StudentLogin;
