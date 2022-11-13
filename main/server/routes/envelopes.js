const envelopesRouter = require("express").Router();
const { Envelope } = require("../models/envelope");

// CREATE ENVELOPE
envelopesRouter.post("/createEnvelope", async (req, res) => {
  /* 
    route needs to be updated to take an array of month ids and check if envelopes exist.
    route needs to take array of monthsIds and create an envelope for each monthId.
  */
  try {
    const { category, budget, monthIds } = req.body;
    const envelopeExists = await Envelope.exists({ category, monthId: monthIds[0] });
    if (envelopeExists) {
      throw new Error("Envelope already exists. Ending process to preserve data");
    }

    const envelope = new Envelope({ category, budget, monthId: monthIds[0] });
    const result = await envelope.save();
    const success = result ? true : false;
    res.status(200).json({ success });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// GET ENVELOPE BY ENVELOPE ID
envelopesRouter.get("/envelope/:envelopeId", async (req, res) => {
  try {
    const { envelopeId } = req.params.envelopeId;
    const data = await Envelope.findById(envelopeId);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET ENVELOPES BY MONTH ID
envelopesRouter.get("/:monthId", async (req, res) => {
  try {
    const { monthId } = req.params;
    console.log("monthId", monthId);
    const data = await Envelope.find({ monthId });
    console.log("data", data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// UPDATE ENVELOPE BY ENVELOPE ID
envelopesRouter.patch("/updateEnvelope", async (req, res) => {
  try {
    const { id, data } = req.body;
    const options = { new: true };
    const result = await Envelope.findByIdAndUpdate(id, data, options);
    res.send(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// UPDATE ENVELOPES BY SELECTED MONTHS AND ENVELOPE NAME
envelopesRouter.patch("/updateEnvelopes", async (req, res) => {
  /*
    this route should 
      - receive an array of monthIds
      - receive envelope data with envelope name included
      - update all envelopes of same name of included monthIds
   */
});

// DELETE ENVELOPE
envelopesRouter.delete("/deleteEnvelope", async (req, res) => {
  const { envelopeId } = req.body;
  const result = await Envelope.findByIdAndDelete(envelopeId);
  const success = result ? true : false;
  res.json({ success });
});

// DELETE ENVELOPES BY MONTH
envelopesRouter.delete("/deleteEnvelopes", async (req, res) => {
  /* 
    this route should 
      - receive an array of monthIds
      - receive an envelope name
      - delete all envelopes of same name of included monthIds
  */
});

// Update all
// Potential to accidentally update every envelope of every month of every year.
envelopesRouter.patch("/updateAll", async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    await Envelope.updateMany({}, { $inc: { budget: amount } });
    res.send();
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Transfer
envelopesRouter.patch("/transfer/:fromId/:toId", async (req, res) => {
  try {
    const { fromId, toId } = req.params;
    const from = await Envelope.findById(fromId);
    const to = await Envelope.findById(toId);
    if (from.budget - Number(req.body.amount) < 0)
      throw new Error(
        `Not enough funds available in ${from.category} budget to transfer to ${to.category}`
      );
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
// These operations should be separate.
envelopesRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id === "all") {
      await Envelope.deleteMany({});
      res.send("All Documents have been deleted..");
    } else {
      const data = await Envelope.findByIdAndDelete(id);
      res.send(`Document with ${data.category} has been deleted..`);
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = envelopesRouter;
