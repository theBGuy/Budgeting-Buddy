const mongoose = require("mongoose");
const { monthSchema, Month } = require("./month");

const yearSchema = new mongoose.Schema({
  year: {
    required: true,
    type: Number,
  },
  budget: {
    required: true,
    type: Number,
  },
  remaining: {
    required: true,
    type: Number,
  },
  spent: {
    type: Number,
    default: 0,
  },
  months: [monthSchema],
});

const Year = mongoose.model("Year", yearSchema);

module.exports = { Year };
