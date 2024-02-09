// // models/sportsItem.js

// const mongoose = require("mongoose");

// const sportsItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   availability: { type: Number, default: 0 },
//   description: { type: String },
//   image: { type: String }, // Image field as a String (URL)
// });

// const SportsItem = mongoose.model("SportsItem", sportsItemSchema);

// module.exports = SportsItem;

const mongoose = require("mongoose");

const sportsItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  availability: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const SportsItem = mongoose.model("SportsItem", sportsItemSchema);

module.exports = SportsItem;
