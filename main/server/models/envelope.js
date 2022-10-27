const mongoose = require("mongoose");

const envelopeSchema = new mongoose.Schema({
  category: {
    required: true,
    type: String
  },
  budget: {
    required: true,
    type: Number
  },
  spent: {
    type: Number, 
    default: 0
  }, 
  monthId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Month"
  }
});

const Envelope = mongoose.model("Envelope", envelopeSchema);

module.exports = { Envelope };