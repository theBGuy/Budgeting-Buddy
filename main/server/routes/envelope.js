const envelopeRouter = require("express").Router();
const envelopeController = require("../controllers/envelope");
const Envelope = require('../models/envelope');

envelopeRouter.post("/", async (req, res, next) => {
    const envelope = new Envelope({ month: req.body.month, category: req.body.category, budget: req.body.budget });

    try {
        if (await Envelope.exists({ month: req.body.month, category: req.body.category })) {
            throw new Error('Envelope already exists. Ending process to preserve data');
        }
        const dataToSave = await envelope.save();
        res.status(200).json(dataToSave);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

envelopeRouter.get("/", async (req, res, next) => {
    try {
        const data = await Envelope.find();
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Get by ID Method
envelopeRouter.get('/:id', async (req, res) => {
    try {
        const data = await Envelope.findById(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Update by ID Method
envelopeRouter.patch('/update/:id', async (req, res) => {
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

// Update all
envelopeRouter.patch('/updateAll', async (req, res) => {
    try {
        const amount = Number(req.body.amount);
        await Envelope.updateMany({}, {$inc: { budget: amount }});
        res.send();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Update by ID Method
envelopeRouter.patch('/transfer/:fromId/:toId', async (req, res) => {
    try {
        const { fromId, toId } = req.params;
        const from = await Envelope.findById(fromId);
        const to = await Envelope.findById(toId);
        if (from.budget - Number(req.body.amount) < 0) 
            throw new Error(`Not enough funds available in ${from.category} budget to transfer to ${to.category}`);
        from.budget -= Number(req.body.amount);
        to.budget += Number(req.body.amount);
        const newTo = await Envelope.findByIdAndUpdate(toId, to);
        await Envelope.findByIdAndUpdate(fromId, from);
        res.send(newTo);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Delete by ID Method or all
envelopeRouter.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (id === 'all') {
            await Envelope.deleteMany({});
            res.send('All Documents have been deleted..');
        } else {
            const data = await Envelope.findByIdAndDelete(id);
            res.send(`Document with ${data.category} has been deleted..`);
        }
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

module.exports = envelopeRouter;