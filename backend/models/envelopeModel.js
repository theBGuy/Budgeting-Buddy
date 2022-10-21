const mongoose = require('mongoose');

const envelopeSchema = new mongoose.Schema({
    category: {
        required: true,
        type: String
    },
    budget: {
        required: true,
        type: Number
    }
});

module.exports = mongoose.model('Envelope', envelopeSchema);