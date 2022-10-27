const mongoose = require("mongoose");

const monthSchema = new mongoose.Schema({
  budget: {
    required: true,
    type: Number
  },
  remaining: {
    required: true,
    type: Number,
  },
  spent: {
    type: Number, 
    default: 0
  }
});

const Month = mongoose.model("Month", monthSchema);

module.exports = { Month, monthSchema };