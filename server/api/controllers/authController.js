const Student = require("../models/studentModel");
const Admin = require("../models/adminModel");
const SportsItem = require("../models/sportsItem");
const Request = require("../models/requestModel");
require("dotenv").config();

// const fs = require("fs");

// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const studentLogin = async (req, res) => {
//   const { userId, rollNumber } = req.body; // Update variable names

//   try {
//     const student = await Student.findOne({ userId });

//     if (!student) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     if (rollNumber === student.rollNumber) {
//       // Update comparison to use rollNumber
//       res.json({ message: "Student login successful", role: "student" });
//     } else {
//       res.status(401).json({ error: "Invalid roll number" });
//     }
//   } catch (error) {
//     console.error("Error during student login:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
const jwt = require("jsonwebtoken");
// Replace with a secure secret key

const studentLogin = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Assuming you have a check for the password here
    if (password === student.password) {
      // Generate JWT token with student details
      const token = jwt.sign(
        {
          userId: student.userId,
          password: student.password,
          role: "student",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expiration time
      );

      res.json({
        token,
        userId: student.userId,
        password: student.password,
        message: "Student login successful",
        role: "student",
      });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during student login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const adminLogin = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const admin = await Admin.findOne({ userId });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (password === admin.password) {
      // Create a JWT token
      const token = jwt.sign(
        {
          userId: admin.userId,
          role: admin.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Set the expiration time
      );
      console.log(token); //generating token
      res.json({ message: "Admin login successful", role: "admin" });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Upload image
// const uploadImage = async (req, res) => {
//   try {
//     const base64Image = req.file.buffer.toString("base64");
//     const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
//     res.json({ success: true, dataUri });
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const handleBorrowRequest = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const updatedItem = await SportsItem.findByIdAndUpdate(
      itemId,
      { $inc: { availability: -1 } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Sports item not found" });
    }

    res.json({ message: "Item borrowed successfully" });
  } catch (error) {
    console.error("Error handling borrow request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addSportsItem = async (req, res) => {
  const { name, availability, description } = req.body;

  try {
    // Check if an image was uploaded
    const image = req.file ? req.file.buffer.toString("base64") : null;

    const newItem = new SportsItem({ name, availability, description, image });
    await newItem.save();
    res.json({ message: "Sports item added successfully" });
  } catch (error) {
    console.error("Error adding sports item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSportsItem = async (req, res) => {
  const itemId = req.params.itemId;
  const { name, availability, description } = req.body;

  try {
    const updatedItem = await SportsItem.findByIdAndUpdate(
      itemId,
      { name, availability, description },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Sports item not found" });
    }

    res.json({ message: "Sports item updated successfully" });
  } catch (error) {
    console.error("Error updating sports item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSportsItem = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const deletedItem = await SportsItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Sports item not found" });
    }

    res.json({ message: "Sports item deleted successfully" });
  } catch (error) {
    console.error("Error deleting sports item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadSportsItem = async (req, res) => {
  try {
    // Save metadata in SportsItem collection
    const newItem = new SportsItem({
      name: req.body.name,
      availability: req.body.availability,
      description: req.body.description,
      image: req.file.filename, // Assuming you save the filename in metadata
    });

    // Save image data in GridFS
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "images", // Use your bucket name
    });

    const uploadStream = bucket.openUploadStream(newItem.image);
    fs.createReadStream(req.file.path).pipe(uploadStream);

    // Save the sports item with image metadata
    await newItem.save();

    res.json({ success: true, message: "Sports item added successfully" });
  } catch (error) {
    console.error("Error adding sports item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllSportsItemsForStudent = async (req, res) => {
  try {
    const sportsItems = await SportsItem.find();

    res.json(sportsItems);
  } catch (error) {
    console.error("Error fetching sports items for student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllSportsItems = async (req, res) => {
  try {
    const sportsItems = await SportsItem.find();
    res.json(sportsItems);
  } catch (error) {
    console.error("Error fetching sports items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSportsItemById = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    // Find the specific sports item by ID
    const sportsItem = await SportsItem.findById(itemId);

    if (!sportsItem) {
      return res.status(404).json({ error: "Sports item not found" });
    }

    // Send the sports item details in the response
    res.json(sportsItem);
  } catch (error) {
    console.error("Error fetching sports item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const requestItem = async (req, res) => {
  const { userId, password } = req.body;
  const sportsItemId = req.params.itemId;

  const sportsItem = await SportsItem.findById(sportsItemId);

  try {
    const existingRequest = await Request.findOne({ userId, sportsItemId });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already exists" });
    }

    const request = new Request({
      userId,
      password,
      sportsItemId,
      availability: sportsItem.availability, // Set the initial availability
      statusDateTime: new Date(),
      requestedTimeAndDate: new Date(),
      approvedTimeAndDate: null, // Set to null initially
      rejectedTimeAndDate: null, // Set to null initially
      handedTimeAndDate: null, // Set to null initially
      returnedTimeAndDate: null, // Set to null initially
    });
    await request.save();
    res.status(200).json({ message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStudentDetails = async (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing Authorization Header" });
  }

  const token = authToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
    const student = await Student.findOne({ userId: decoded.userId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Return user details
    res.json({
      userId: student.userId,
      password: student.password,
      // Add other fields you want to include
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const cancelRequest = async (req, res) => {
  const { userId, password } = req.body;
  const sportsItemId = req.params.itemId;
  const sportsItem = await SportsItem.findById(sportsItemId);
  //availability = sportsItem.availability

  try {
    // Find and delete the request
    await Request.findOneAndDelete({
      userId,
      password,
      sportsItemId,
    });

    res.status(200).json({ message: "Request canceled successfully" });
  } catch (error) {
    console.error("Error canceling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  // Perform logout logic, such as clearing the token
  // Respond with a success message or redirect to the login page
  res.json({ message: "Logout successful" });
};

const getRequestedItems = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requestedItems = await Request.find({
      userId,
    }).populate("sportsItemId", [
      "name",
      "availability",
      "description",
      "statusDateTime",
      "image",
    ]);

    res.json(requestedItems);
  } catch (error) {
    console.error("Error fetching requested items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getItemsRequests = async (req, res) => {
  try {
    // Fetch items requests from the Request model, and populate the sportsItemId
    const itemsRequests = await Request.find().populate("sportsItemId");

    // Group requests by sports item name
    const groupedRequests = {};
    itemsRequests.forEach((request) => {
      const itemName = request.sportsItemId ? request.sportsItemId.name : "N/A";
      if (!groupedRequests[itemName]) {
        groupedRequests[itemName] = [];
      }

      const formattedRequest = {
        _id: request._id,
        userId: request.userId,
        password: request.password,
        sportsItemId: request.sportsItemId,
        status: request.status,
        availability: request.availability,
        statusDateTime: request.statusDateTime, // Include the statusDateTime field
        requestedTimeAndDate: request.requestedTimeAndDate,
        approvedTimeAndDate: request.approvedTimeAndDate,
        rejectedTimeAndDate: request.rejectedTimeAndDate,
        handedTimeAndDate: request.handedTimeAndDate,
        returnedTimeAndDate: request.returnedTimeAndDate,
      };

      groupedRequests[itemName].push(formattedRequest);
    });

    res.status(200).json(groupedRequests);
  } catch (error) {
    console.error("Error fetching items requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveRejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    // Find the request
    const request = await Request.findById(requestId);
    if (status == "rejected") {
      request.rejectedTimeAndDate = new Date();
    }
    else {
      request.approvedTimeAndDate = new Date(); 
    }
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Update the status of the request
    request.status = status;
    // Set the status change date and time
    await request.save();

    // If approved, decrement the availability of the sports item
    if (status === "approved") {
      
      const sportsItemId = request.sportsItemId;
      const sportsItem = await SportsItem.findById(sportsItemId);

      if (sportsItem && sportsItem.availability > 0) {
        sportsItem.availability -= 1;
        await sportsItem.save();
      }
    }


    res.status(200).json({
      message: "Request status and availability updated successfully",
    });
  } catch (error) {
    console.error("Error updating request status and availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const markGiven = async (req, res) => {
  try {
    const requestId = req.params.id;

    // Update the status of the request to "given"
    await Request.findByIdAndUpdate(requestId, {
      status: "handed",
      handedTimeAndDate: new Date(), // Set the status change date and time
    });

    res.status(200).json({ message: "Request marked as given" });
  } catch (error) {
    console.error("Error marking as given:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Mark item as received and increment availability
const markReceivedAndIncrementAvailability = async (req, res) => {
  try {
    const requestId = req.params.id;

    // Update the status of the request to "returned"
    await Request.findByIdAndUpdate(requestId, {
      status: "returned",
      returnedTimeAndDate: new Date(), // Set the status change date and time
    });

    // Increment availability count for the corresponding sports item
    const request = await Request.findById(requestId);
    const sportsItemId = request?.sportsItemId;
    if (sportsItemId) {
      await SportsItem.findByIdAndUpdate(sportsItemId, {
        $inc: { availability: 1 },
      });
    }

    res.status(200).json({
      message: "Request marked as received, and availability count incremented",
    });
  } catch (error) {
    console.error(
      "Error marking as received and incrementing availability:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const sportsItemId = req.params.id;
    const { availability } = req.body;

    // Update availability count for the corresponding sports item
    await SportsItem.findByIdAndUpdate(sportsItemId, {
      availability,
    });

    res.status(200).json({
      message: "Availability count updated successfully",
    });
  } catch (error) {
    console.error("Error updating availability count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSportsItemImageByName = async (req, res) => {
  try {
    const { itemName } = req.params;

    // Fetch sports item image by name logic
    const sportsItem = await SportsItem.findOne({ name: itemName });

    if (sportsItem) {
      res.status(200).json({ image: sportsItem.image }); // Assuming the image is stored in base64 format
    } else {
      res.status(404).json({ error: "Sports item not found" });
    }
  } catch (error) {
    console.error("Error fetching sports item image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProfileImg = async (req, res) => {
  try {
    const { userId } = req.params;
    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ profileImg: student.profileImg });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  adminLogin,
  studentLogin,

  updateSportsItem,
  deleteSportsItem,
  addSportsItem,
  handleBorrowRequest,
  getSportsItemById,
  getAllSportsItems,
  uploadSportsItem,
  getAllSportsItemsForStudent,
  // ... (export other functions)

  requestItem,
  cancelRequest,
  logout,
  getRequestedItems,

  getItemsRequests,
  approveRejectRequest,
  markGiven,
  markReceivedAndIncrementAvailability,
  updateAvailability,
  getSportsItemImageByName,

  getRequests,

  getStudentDetails,

  getProfileImg,
};

// uploadImage,
