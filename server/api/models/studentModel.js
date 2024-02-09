const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student", // Set a default role if needed
  },
  profileImg: {
    type: String, // Assuming you store the image as a URL or base64 string
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
