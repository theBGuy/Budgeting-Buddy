const envelopeRouter = require("express").Router();
const { Year } = require("../models/year");
const { Envelope } = require("../models/envelope");
const envelopeController = require("../controllers/envelope.controller");

/**
 * @description Create new envelopes for array of month ids
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are adding envelopes to
 * @param {string} req.body.category - string description of envelope category
 * @param {number} req.body.budget - numerical value of of allocated budget for envelope
 * @param {Array} req.body.monthIds - Array of numerical monthId's to create envelopes for
 */
envelopeRouter.post("/createEnvelope", envelopeController.createEnvelope);

/**
 * @description GET ENVELOPE BY ENVELOPE ID
 * @param {ObjectId} envelopeId - mongodb _id
 */
envelopeRouter.get("/by-id/:envelopeId", envelopeController.getEnvelopeById);

/**
 * @description GET ENVELOPES BY MONTH ID
 * @param {ObjectId} envelopeId - mongodb _id
 */ 
envelopeRouter.get("/by-monthId/:monthId", envelopeController.getEnvelopeByMonthId);

/**
 * @description GET ENVELOPES BY CATEGORY
 * @param {string} category
 */
envelopeRouter.get("/by-category/:category", envelopeController.getEnvelopeByCategory);

/**
 * @description UPDATE ENVELOPE BY ENVELOPE ID
 * @param {Object} req.body - Needs to have envelope info included
 * @param {ObjectId} envelopeId - mongodb _id of envelope
 * @param {Object} req.body.data - envelope info to update
 */ 
envelopeRouter.patch("/by-id/:envelopeId", envelopeController.updateEnvelopeById);

/**
 * @description UPDATE ENVELOPES BY SELECTED MONTHS AND ENVELOPE NAME
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are updating envelopes for
 * @param {Object} req.body.envelope - envelope object containing updated info
 * @param {Array} req.body.monthIds - Array of numerical monthId's to update envelopes for
 * @param {Array} req.body.envelopes - Array of existing envelope objects
 */
envelopeRouter.patch("/updateEnvelopes", envelopeController.updateEnvelopes);

/**
 * @description DELETE ENVELOPE BY ENVELOPE ID
 * @param {Object} req.body - Needs to have envelope info included
 * @param {ObjectId} req.body.envelopeId - mongodb _id of envelope
 */ 
envelopeRouter.delete("/deleteEnvelope", async (req, res) => {
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
envelopeRouter.delete("/deleteEnvelopes", async (req, res) => {
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
envelopeRouter.delete("/deleteAll", async (req, res) => {
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

module.exports = envelopeRouter;
