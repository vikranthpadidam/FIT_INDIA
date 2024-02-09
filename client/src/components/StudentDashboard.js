import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDashboard = () => {
  const [sportsItems, setSportsItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [requestedItems, setRequestedItems] = useState([]); // Track requested items
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    fetchUserId();
    fetchStudentSportsItems();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/student_details",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserId(response.data.userId);
      setPassword(response.data.password);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchStudentSportsItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/sportsItemsss"
      );
      setSportsItems(response.data);
    } catch (error) {
      console.error("Error fetching sports items for student:", error);
    }
  };

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

  useEffect(() => {
    fetchRequestedItems();
    fetchProfileImage();
  }, [userId]); // Fetch requested items when userId changes

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

  const isItemRequested = (itemId) =>
    requestedItems.some((item) => item.sportsItemId?._id === itemId);

  const isRequestPending = (itemId) =>
    requestedItems.some(
      (item) => item.sportsItemId?._id === itemId && item.status === "pending"
    );

  const handleRequestItem = async (itemId) => {
    try {
      // Check if the item is already requested
      const isItemAlreadyRequested = isItemRequested(itemId);

      if (isItemAlreadyRequested) {
        toast.warning("Item has already been requested!");
        return;
      }

      const selectedItem = sportsItems.find((item) => item._id === itemId);

      if (!selectedItem || selectedItem.availability <= 0) {
        toast.warning("Item is not available!");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/auth/requestItem/${itemId}`,
        {
          userId,
          password,
        }
      );

      if (response.status === 200) {
        toast.success("Item requested successfully!");
        fetchStudentSportsItems(); // Refresh the list after a successful request
        fetchRequestedItems(); // Refresh the requested items
      } else {
        toast.error(`Error requesting sports item: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error requesting sports item:", error);
      toast.error("Item already requested.");
    }
  };

  const handleCancelRequest = async (itemId) => {
    try {
      if (!isRequestPending(itemId)) {
        toast.warning(
          "you cannot cancel now,No pending request for this item!"
        );
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/auth/cancelRequest/${itemId}`,
        {
          data: {
            userId,
            password,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Request canceled successfully!");
        fetchStudentSportsItems(); // Refresh the list after a successful cancel
        fetchRequestedItems(); // Refresh the requested items
      } else {
        toast.error(`Error canceling request: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error canceling request:", error);
      toast.error("Error canceling request");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navigateToMyRequest = () => {
    navigate(`/my_requests/${userId}`);
  };

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
                <p className="fs-2">User ID: {userId}</p>
              </li>
              <li className="nav-item">
                <p className="fs-2">Password: {password}</p>
              </li>
              <li className="nav-item">
                <button
                  onClick={navigateToMyRequest}
                  className="btn btn-primary btn-block"
                >
                  Requested Items
                </button>
              </li>
              {/* Add other navigation links/buttons as needed */}
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-block"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <h2 className="mt-4 mb-3">Student Dashboard</h2>
          <div>
            <h3>Sports Items List</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Availability</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sportsItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.image && (
                        <img
                          src={`data:image/png;base64,${item.image}`}
                          alt={item.name}
                          style={{ maxWidth: "360px", maxHeight: "360px" }}
                        />
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.availability}</td>
                    <td>{item.description}</td>
                    <td>
                      <button
                        onClick={() => handleRequestItem(item._id)}
                        className="btn btn-success mr-2"
                        disabled={
                          isItemRequested(item._id) || item.availability <= 0
                        }
                      >
                        Request Item
                      </button>
                      <button
                        onClick={() => handleCancelRequest(item._id)}
                        className="btn btn-warning"
                        disabled={
                          !isItemRequested(item._id) ||
                          [
                            "approved",
                            "rejected",
                            "handed",
                            "returned",
                          ].includes(item.status)
                        }
                      >
                        Cancel Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
