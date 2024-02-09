// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Tag } from "antd";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineUndo,
} from "react-icons/ai";

// MyRequests component
const MyRequests = () => {
  const [requestedItems, setRequestedItems] = useState([]);
  const { userId } = useParams(); // Get userId from route parameters
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState(null);
  const [rollNo, setRollNo] = useState("");

  useEffect(() => {
    fetchRequestedItems();
    fetchStudentDetails();
    fetchProfileImage();
  }, [userId]); // Fetch data when userId changes

  const fetchRequestedItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/requestedItems/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRequestedItems(response.data);
    } catch (error) {
      console.error("Error fetching requested items:", error);
    }
  };

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/student_details`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRollNo(response.data.password);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/profileImg/${userId}`
      );
      setProfileImg(response.data.profileImg);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const handleDashboardClick = () => {
    navigate("/student_dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Sidebar */}
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                {profileImg && (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="img-fluid rounded-circle mb-2"
                  />
                )}
              </li>
              <li className="nav-item">
                <p className="fs-4">User ID: {userId}</p>
              </li>
              <li className="nav-item">
                <p className="fs-4">Roll No: {rollNo}</p>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleDashboardClick}
                  className="btn btn-primary"
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <h2 className="mt-4 mb-3">My Requested Items</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Sports Item</th>
                <th>Availability</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requestedItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.sportsItemId && item.sportsItemId.image ? (
                      <img
                        src={`data:image/png;base64,${item.sportsItemId.image}`}
                        alt={item.sportsItemId.name || "Image"}
                        style={{ maxWidth: "360px", maxHeight: "360px" }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{item.sportsItemId ? item.sportsItemId.name : "N/A"}</td>
                  <td>
                    {item.sportsItemId ? item.sportsItemId.availability : "N/A"}
                  </td>

                  <td>
                    <div>
                      Requested Time:{" "}
                      {item.requestedTimeAndDate
                        ? new Date(item.requestedTimeAndDate).toLocaleString()
                        : "N/A"}
                    </div>
                    <div>
                      Approved Time:{" "}
                      {item.approvedTimeAndDate
                        ? new Date(item.approvedTimeAndDate).toLocaleString()
                        : "N/A"}
                    </div>
                    <div>
                      Rejected Time:{" "}
                      {item.rejectedTimeAndDate
                        ? new Date(item.rejectedTimeAndDate).toLocaleString()
                        : "N/A"}
                    </div>
                    <div>
                      Handed Time:{" "}
                      {item.handedTimeAndDate
                        ? new Date(item.handedTimeAndDate).toLocaleString()
                        : "N/A"}
                    </div>
                    <div>
                      Returned Time:{" "}
                      {item.returnedTimeAndDate
                        ? new Date(item.returnedTimeAndDate).toLocaleString()
                        : "N/A"}
                    </div>
                  </td>
                  <td>
                    {item.status === "requested" ? (
                      <Tag color="success" icon={<AiOutlineCheckCircle />}>
                        {item.status}
                      </Tag>
                    ) : item.status === "approved" ? (
                      <Tag color="success" icon={<AiOutlineCheckCircle />}>
                        {item.status}
                      </Tag>
                    ) : item.status === "rejected" ? (
                      <Tag color="processing" icon={<AiOutlineCheck />}>
                        {item.status}
                      </Tag>
                    ) : item.status === "handed" ? (
                      <Tag color="processing" icon={<AiOutlineCheck />}>
                        {item.status}
                      </Tag>
                    ) : item.status === "returned" ? (
                      <Tag color="gold" icon={<AiOutlineUndo />}>
                        {item.status}
                      </Tag>
                    ) : (
                      <Tag color="error" icon={<AiOutlineClose />}>
                        {item.status}
                      </Tag>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default MyRequests;
