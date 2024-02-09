// AdminDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [itemName, setItemName] = useState("");
  const [itemAvailability, setItemAvailability] = useState(0);
  const [itemDescription, setItemDescription] = useState("");
  const [sportsItems, setSportsItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch sports items from the backend
    fetchSportsItems();
  }, []);

  const fetchSportsItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/sportsItems"
      );
      setSportsItems(response.data);
    } catch (error) {
      console.error("Error fetching sports items:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleAddItem = async () => {
    try {
      // Create a FormData object to send both text and file data
      const formData = new FormData();
      formData.append("name", itemName); // Ensure name is appended to the FormData
      formData.append("availability", itemAvailability);
      formData.append("description", itemDescription);
      formData.append("image", selectedFile);

      await axios.post("http://localhost:5000/api/auth/sportsItems", formData);
      // After adding the item, fetch the updated list
      fetchSportsItems();
      // Reset input fields
      setItemName("");
      setItemAvailability(0);
      setItemDescription("");
      setSelectedFile(null);
      // Close the modal
      setShowAddItemModal(false);
    } catch (error) {
      console.error("Error adding sports item:", error);
    }
  };

  const handleUpdateAvailability = async (itemId) => {
    try {
      // Prompt the user for the updated availability
      const updatedAvailability = prompt(
        `Update availability for ${itemName} (current value: ${itemAvailability}):`,
        itemAvailability
      );

      // Send a PUT request to update only the availability
      await axios.put(`http://localhost:5000/api/auth/sportsItems/${itemId}`, {
        availability: updatedAvailability,
      });

      // After updating the availability, fetch the updated list
      fetchSportsItems();
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/sportsItems/${itemId}`
      );
      // After deleting the item, fetch the updated list
      fetchSportsItems();
    } catch (error) {
      console.error("Error deleting sports item:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-4 text-center">
      <h2>Admin Dashboard</h2>

      <div className="mt-3">
        <Link to="/items_request">
          <button className="btn btn-primary me-2">Items Request</button>
        </Link>
        <button
          className="btn btn-success me-2"
          onClick={() => setShowAddItemModal(true)}
        >
          Add New Item
        </button>
        <div className="logout-button">
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      {showAddItemModal && (
        <div className="mt-3">
          <h3>Add New Sports Item</h3>
          <form>
            <div className="mb-3">
              <label className="form-label">Item Name:</label>
              <input
                type="text"
                className="form-control"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Availability:</label>
              <input
                type="number"
                className="form-control"
                value={itemAvailability}
                onChange={(e) => setItemAvailability(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <input
                type="text"
                className="form-control"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image:</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleAddItem}
            >
              Add Item
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setShowAddItemModal(false)}
            >
              Close
            </button>
          </form>
        </div>
      )}

      <div className="mt-4">
        <h3>Sports Items List</h3>
        <table className="table">
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
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdateAvailability(item._id)}
                  >
                    Update Count
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
