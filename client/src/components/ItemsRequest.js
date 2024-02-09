import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faHandPaper,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ItemsRequest = () => {
  const [groupedRequests, setGroupedRequests] = useState([]);
  const [imageData, setImageData] = useState({});

  // useEffect(() => {
  //   fetchItemsRequests();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/items_requests"
        );
        setGroupedRequests(response.data);

        // Fetch images concurrently
        const imagePromises = Object.keys(response.data).map(
          async (itemName) => {
            const imageResponse = await axios.get(
              `http://localhost:5000/api/auth/getSportsItemImageByName/${itemName}`
            );
            return { [itemName]: imageResponse.data.image };
          }
        );

        const images = await Promise.all(imagePromises);
        setImageData(Object.assign({}, ...images));
      } catch (error) {
        console.error("Error fetching items requests:", error);
      }
    };
    fetchItemsRequests();
    fetchData();
  }, []);

  const updateGroupedRequests = (requestId, updateFn) => {
    setGroupedRequests((prevGroupedRequests) => {
      const updatedGroupedRequests = Object.entries(prevGroupedRequests).map(
        ([itemName, itemRequests]) => [
          itemName,
          itemRequests.map((request) =>
            request._id === requestId ? updateFn(request) : request
          ),
        ]
      );
      return Object.fromEntries(updatedGroupedRequests);
    });
  };

  const handleApproveReject = async (requestId, status) => {
    try {
      // Send request to update status
      const response = await axios.put(
        `http://localhost:5000/api/auth/approve_reject_request/${requestId}`,
        { status }
      );

      if (response.status === 200) {
        // If approved, decrement the availability of the sports item
        if (status === "approved") {
          const sportsItemId = groupedRequests[requestId]?.sportsItemId;
          const sportsItem = await fetchSportsItem(sportsItemId);

          if (sportsItem && sportsItem.availability > 0) {
            sportsItem.availability -= 1;
            await axios.put(
              `http://localhost:5000/api/auth/update_availability/${sportsItemId}`,
              { availability: sportsItem.availability }
            );

            // Update the availability in the state
            updateGroupedRequests(requestId, (request) => ({
              ...request,
              sportsItemId: {
                ...request.sportsItemId,
                availability: sportsItem.availability,
              },
            }));
          }

          // Update the approvedTimeAndDate for the specific request
          updateGroupedRequests(requestId, (request) => ({
            ...request,
            approvedTimeAndDate: new Date().toLocaleString(),
            status: "approved",
          }));
        } else if (status === "rejected") {
          // Update the rejectedTimeAndDate for the specific request
          updateGroupedRequests(requestId, (request) => ({
            ...request,
            rejectedTimeAndDate: new Date().toLocaleString(),
            status: "rejected",
          }));
        }
      } else {
        console.error("Error updating status:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleGiven = async (requestId) => {
    try {
      // Send request to mark as handed
      await axios.put(`http://localhost:5000/api/auth/mark_given/${requestId}`);

      // Update the handedTimeAndDate for the specific request
      updateGroupedRequests(requestId, (request) => ({
        ...request,
        handedTimeAndDate: new Date().toLocaleString(),
        status: "handed",
      }));
    } catch (error) {
      console.error("Error marking as given:", error);
    }
  };

  const handleReceived = async (requestId) => {
    try {
      // Send request to mark as received and increment availability
      await axios.put(
        `http://localhost:5000/api/auth/mark_received_and_increment_availability/${requestId}`
      );

      // Update the returnedTimeAndDate for the specific request
      updateGroupedRequests(requestId, (request) => ({
        ...request,
        returnedTimeAndDate: new Date().toLocaleString(),
        status: "returned",
      }));
    } catch (error) {
      console.error(
        "Error marking as received and incrementing availability:",
        error
      );
    }
  };

  const fetchItemsRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/items_requests"
      );
      setGroupedRequests(response.data);
    } catch (error) {
      console.error("Error fetching items requests:", error);
    }
  };

  const fetchSportsItem = async (sportsItemId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/getSportsItem/${sportsItemId}`
      );

      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error fetching sports item:", response.data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching sports item:", error);
      return null;
    }
  };
  const fetchSportsItemImage = async (itemName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/getSportsItemImageByName/${itemName}`
      );

      if (response.status === 200) {
        return response.data.image;
      } else {
        console.error("Error fetching sports item image:", response.data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching sports item image:", error);
      return null;
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Items Requests</h2>
      <div className="request-boxes">
        {Object.entries(groupedRequests).map(([itemName, itemRequests]) => (
          <div key={itemName} className="request-box">
            <h3>Sports Item: {itemName}</h3>

            <div className="item-image">
              {/* Display the sports item image */}
              {imageData[itemName] && (
                <img
                  src={`data:image/png;base64,${imageData[itemName]}`}
                  alt={itemName}
                  style={{ maxWidth: "360px", maxHeight: "360px" }}
                />
              )}
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Roll No</th>
                  <th>Availability</th>
                  <th>Time</th>
                  <th> </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {itemRequests.map((request) => (
                  <React.Fragment key={request._id}>
                    <tr>
                      <td>{request.userId}</td>
                      <td>{request.password}</td>
                      <td>
                        {request.sportsItemId
                          ? request.sportsItemId.availability
                          : "N/A"}
                      </td>
                      <td>
                        <div>
                          Requested Time:{" "}
                          {request.requestedTimeAndDate
                            ? new Date(
                                request.requestedTimeAndDate
                              ).toLocaleString()
                            : "N/A"}
                        </div>
                        <div>
                          Approved Time:{" "}
                          {request.approvedTimeAndDate
                            ? new Date(
                                request.approvedTimeAndDate
                              ).toLocaleString()
                            : "N/A"}
                        </div>
                        <div>
                          Rejected Time:{" "}
                          {request.rejectedTimeAndDate
                            ? new Date(
                                request.rejectedTimeAndDate
                              ).toLocaleString()
                            : "N/A"}
                        </div>
                        <div>
                          Handed Time:{" "}
                          {request.handedTimeAndDate
                            ? new Date(
                                request.handedTimeAndDate
                              ).toLocaleString()
                            : "N/A"}
                        </div>
                        <div>
                          Returned Time:{" "}
                          {request.returnedTimeAndDate
                            ? new Date(
                                request.returnedTimeAndDate
                              ).toLocaleString()
                            : "N/A"}
                        </div>
                      </td>

                      <td>{request.status}</td>

                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-success mr-2"
                            onClick={() =>
                              handleApproveReject(request._id, "approved")
                            }
                            disabled={request.status === "approved"}
                          >
                            <FontAwesomeIcon icon={faCheck} /> Approve
                          </button>
                          <button
                            className="btn btn-danger mr-2"
                            onClick={() =>
                              handleApproveReject(request._id, "rejected")
                            }
                            disabled={request.status === "rejected"}
                          >
                            <FontAwesomeIcon icon={faTimes} /> Reject
                          </button>
                          <button
                            className="btn btn-warning mr-2"
                            onClick={() => handleGiven(request._id)}
                            disabled={request.status === "handed"}
                          >
                            <FontAwesomeIcon icon={faHandPaper} /> Handed
                          </button>
                          <button
                            className="btn btn-info"
                            onClick={() => handleReceived(request._id)}
                            disabled={request.status === "returned"}
                          >
                            <FontAwesomeIcon icon={faUndo} /> Returned
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr></tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsRequest;
