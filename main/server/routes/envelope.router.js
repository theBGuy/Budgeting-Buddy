const envelopeRouter = require("express").Router();
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
envelopeRouter.delete("/deleteEnvelope", envelopeController.deleteEnvelopeById);

/**
 * @description DELETE ENVELOPES BY MONTH
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are deleting envelopes for
 * @param {string} req.body.category - envelope category
 * @param {Array} req.body.monthIds - Array of numerical monthId's to delete envelopes for
 * @todo Write this function
 */
envelopeRouter.delete("/deleteEnvelopes", envelopeController.deleteEnvelopes);

/**
 * @description DELETE ALL ENVELOPES ACROSS ALL YEARS
 */ 
envelopeRouter.delete("/deleteAll", envelopeController.deleteAllEnvelopes);

module.exports = envelopeRouter;
