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

/**
 * @description GET ENVELOPE BY ENVELOPE ID
 * @param {ObjectId} envelopeId - mongodb _id
 */ 
envelopesRouter.get("/envelope/:envelopeId", async (req, res) => {
  try {
    const { envelopeId } = req.params.envelopeId;
    const data = await Envelope.findById(envelopeId);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @description GET ENVELOPES BY MONTH ID
 * @param {ObjectId} envelopeId - mongodb _id
 */ 
envelopesRouter.get("/:monthId", async (req, res) => {
  try {
    const { monthId } = req.params;
    const data = await Envelope.find({ monthId });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

envelopesRouter.get("/by-category/:category", async (req, res) => {
  const { category } = req.params;
  const data = await Envelope.find({ category });
  res.json(data);
});

/**
 * @description UPDATE ENVELOPE BY ENVELOPE ID
 * @param {Object} req.body - Needs to have envelope info included
 * @param {ObjectId} req.body.id - mongodb _id of envelope
 * @param {Object} req.body.data - envelope info to update
 */ 
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

/**
 * @description UPDATE ENVELOPES BY SELECTED MONTHS AND ENVELOPE NAME
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are updating envelopes for
 * @param {Object} req.body.envelope - envelope object containing updated info
 * @param {Array} req.body.monthIds - Array of numerical monthId's to update envelopes for
 */
envelopesRouter.patch("/updateEnvelopes", async (req, res) => {
  /*
    this route should 
      - receive an array of monthIds
      - receive envelope data with envelope name included
      - update all envelopes of same name of included monthIds
      - should this update each envelope with the same value or take an array of envelope info to update?
   */
  try {
    res.status(501);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @description DELETE ENVELOPE BY ENVELOPE ID
 * @param {Object} req.body - Needs to have envelope info included
 * @param {ObjectId} req.body.envelopeId - mongodb _id of envelope
 */ 
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
/**
 * @description DELETE ENVELOPES BY MONTH
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are deleting envelopes for
 * @param {string} req.body.category - envelope category
 * @param {Array} req.body.monthIds - Array of numerical monthId's to delete envelopes for
 */
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

/**
 * @description DELETE ALL ENVELOPES ACROSS ALL YEARS
 */ 
envelopesRouter.delete("/deleteAll", async (req, res) => {
  try {
    await Envelope.deleteMany();
    // now handle all the years
    const updateDocument = {
      $set: { "months.$[].allocatedBudget": 0 },
    };
    const options = {
      new: true,
    };
    await Year.updateMany({}, updateDocument, options );
    res.send("All Documents have been deleted..");
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = envelopesRouter;
