const express = require("express");
const authControllers = require("../controllers/authController");
const router = express.Router();
//const upload = require('../../config/multer');
// Use gfs in your routes/controllers
//const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Use memory storage for FormData
const upload = multer({ storage: storage });

router.post("/student_login", authControllers.studentLogin);
router.post("/admin_login", authControllers.adminLogin);



//Get the sports byID
router.get("/sportsItems/:itemId", authControllers.getSportsItemById);

// Add a new sports item
// router.post("/sportsItems", authControllers.addSportsItem);
router.post(
  "/sportsItems",
  upload.single("image"),
  authControllers.addSportsItem
);

// Get all sports items
router.get("/sportsItems", authControllers.getAllSportsItems);


// Update a sports item
router.put("/sportsItems/:itemId", authControllers.updateSportsItem);

// Delete a sports item
router.delete("/sportsItems/:itemId", authControllers.deleteSportsItem);

// router.post(
//   "/sportsItems/upload",
//   upload.single("image"),
//   authControllers.uploadSportsItem
// );

// authRoutes.js

router.get("/sportsItemsss", authControllers.getAllSportsItemsForStudent);

router.post("/requestItem/:itemId", authControllers.requestItem);
router.delete("/cancelRequest/:itemId", authControllers.cancelRequest);
router.get("/requestedItems/:userId", authControllers.getRequestedItems);
router.get("/items_requests", authControllers.getItemsRequests); // New route for Items Requests
router.put("/approve_reject_request/:id", authControllers.approveRejectRequest); // New route for Approval/Rejection
router.put("/mark_given/:id", authControllers.markGiven);
// Mark item as received and increment availability
router.put(
  "/mark_received_and_increment_availability/:id",
  authControllers.markReceivedAndIncrementAvailability
);
router.get(
  "/getSportsItemImageByName/:itemName",
  authControllers.getSportsItemImageByName
);

router.get("/profileImg/:userId", authControllers.getProfileImg);

router.post("/logout", authControllers.logout);

router.get("/requests", authControllers.getRequests);

router.get("/student_details", authControllers.getStudentDetails);

router.put("/update_availability/:id", authControllers.updateAvailability);

module.exports = router;
