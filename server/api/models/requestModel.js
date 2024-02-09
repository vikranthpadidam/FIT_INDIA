// const mongoose = require("mongoose");

// const requestSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   sportsItemId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "SportsItem",
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected", "handed", "returned"],
//     default: "pending",
//   },
//   availability: {
//     type: Number,
//     default: 0,
//   },
//   statusDateTime: {
//     type: Date,
//   },
// });

// const Request = mongoose.model("Request", requestSchema);

// module.exports = Request;

const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sportsItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SportsItem",
    required: true,
  },
  status: {
    type: String,
    enum: ["requested", "approved", "rejected", "handed", "returned"],
    default: "requested",
  },
  availability: {
    type: Number,
    default: 0,
  },
  requestedTimeAndDate: {
    type: Date,
    // default: Date.now,
    required: true,
  },

  approvedTimeAndDate: {
    type: Date,
    required: false,
  },
  rejectedTimeAndDate: {
    type: Date,
    required: false,
  },
  handedTimeAndDate: {
    type: Date,
    required: false,
  },
  returnedTimeAndDate: {
    type: Date,
    required: false,
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
