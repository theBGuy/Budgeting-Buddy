const express = require('express');
const router = express.Router();
const Envelope = require('../models/envelopeModel');

// Post Method
router.post('/envelopes', async (req, res) => {
    const envelope = new Envelope({ category: req.body.category, budget: req.body.budget });

    try {
        if (await Envelope.exists({ category: req.body.category })) throw new Error("Envelope already exists. Ending process to preserve data");
        const dataToSave = await envelope.save();
        res.status(200).json(dataToSave);
    } catch (e) {
        alert(e.message);
        res.status(400).json({ message: e.message });
    }
});

// Get all Method
router.get('/envelopes', async (req, res) => {
    try {
        const data = await Envelope.find();
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Get by ID Method
router.get('/:id', async (req, res) => {
    try {
        const data = await Envelope.findById(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Update by ID Method
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        const result = await Envelope.findByIdAndUpdate(id, updatedData, options);
        res.send(result);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Delete by ID Method
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Envelope.findByIdAndDelete(id);
        res.send(`Document with ${data.name} has been deleted..`);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

module.exports = router;