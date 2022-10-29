const mongoose = require("mongoose");

const envelopeSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
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