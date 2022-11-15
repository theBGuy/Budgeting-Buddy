const envelopesRouter = require("express").Router();
const { Year } = require("../models/year");
const { Envelope } = require("../models/envelope");

/**
 * @description Create new envelopes for array of month ids
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are adding envelopes to
 * @param {string} req.body.category - string description of envelope category
 * @param {number} req.body.budget - numerical value of of allocated budget for envelope
 * @param {Array} req.body.monthIds - Array of numerical monthId's to create envelopes for
 */
envelopesRouter.post("/createEnvelope", async (req, res) => {
  try {
    const { year, category, budget, monthIds } = req.body;
    const yearData = await Year.findOne({ year: year });
    const updateDocument = {
      $inc: {
      },
    };

    // Alright we've found the year, now lets iterate our months
    for (let i = 0; i < yearData.months.length; i++) {
      const [month, index] = [yearData.months[i], i];
      if (monthIds.find(id => id === month._id.toString())) {
        if (month.allocatedBudget >= month.budget) {
          // probably should give some sort of window message here, or potentially gray out envelope creation for the month
          console.log(`${month.month} has no budget left to allocate for new envelopes.`);
          continue;
        }
        const remainingBudget = month.budget - month.allocatedBudget;
        // If we attempt to allocate more than available, set amount equal to the monthly budget total
        const setBudget = budget > remainingBudget ? remainingBudget : budget;
        // check if there already exists an envelope for this category
        const existingEnvelope = await Envelope.findOne({ category, monthId: month._id });
        if (existingEnvelope) {
          await Envelope.findByIdAndUpdate(existingEnvelope._id, { $set: { budget: setBudget }});
        } else {
          const envelope = new Envelope({ category, budget: setBudget, monthId: month._id });
          await envelope.save();
        }
        updateDocument["$inc"][`months.${index}.allocatedBudget`] = setBudget;
      }
    }

    const updated = await Year.findOneAndUpdate(
      { year: year },
      updateDocument,
      { new: true, upsert: true }
    );
    res.status(200).json({ updated });
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
  try {
    res.status(501);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE ENVELOPE
envelopesRouter.delete("/deleteEnvelope", async (req, res) => {
  try {
    const { envelopeId } = req.body;
    const result = await Envelope.findByIdAndDelete(envelopeId);
    // if sucessfully deleted, we need to return the budget that had been allocated to this envelope to the month to be used again
    if (result) {
      // for some reason there isn't a @subtract of @decrement...so we add the negative value to decrease the value of allocatedBudget
      const updateDocument = {
        $inc: { "months.$.allocatedBudget": Number(result.budget) * -1 },
      };
      const options = {
        new: true,
      };
      await Year.findOneAndUpdate(
        { "months._id": result.monthId },
        updateDocument,
        options
      );
    }
    const success = !!result;
    res.status(200).json({ success });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE ENVELOPES BY MONTH
envelopesRouter.delete("/deleteEnvelopes", async (req, res) => {
  /* 
    this route should 
      - receive an array of monthIds
      - receive an envelope name
      - delete all envelopes of same name of included monthIds
  */
  try {
    res.status(501);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
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
