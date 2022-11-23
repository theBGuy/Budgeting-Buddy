const httpStatus = require("http-status");
const { Year } = require("../models/year");
const { Envelope } = require("../models/envelope");
const ApiError = require("../utils/ApiError");

/**
 * @description GET ENVELOPE BY ENVELOPE ID
 * @param {ObjectId} envelopeId - mongodb _id
 * @returns {Promise<Envelope>}
 */
const getEnvelopeById = async (envelopeId) => {
  return Envelope.findById(envelopeId);
};

/**
 * @description GET ENVELOPES BY MONTH ID
 * @param {ObjectId} envelopeId - mongodb _id
 * @returns {Promise<Envelope>}
 */
const getEnvelopeByMonthId = async (monthId) => {
  return Envelope.find({ monthId });
};

/**
 * @description GET ENVELOPES BY CATEGORY
 * @param {string} category
 * @returns {Promise<Envelope>}
 */
const getEnvelopeByCategory = async (category) => {
  return Envelope.find({ category });
};

/**
 * @description Create new envelope(s) for array of month ids
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are adding envelopes to
 * @param {string} req.body.category - string description of envelope category
 * @param {number} req.body.budget - numerical value of of allocated budget for envelope
 * @param {Array} req.body.monthIds - Array of numerical monthId's to create envelopes for
 * @return {{updatedYear: Promise<Year>, newEnvelopes: Array<Envelope>}}
 */

const createEnvelope = async ({ year, category, budget, monthIds }) => {
  const newEnvelopes = [];
  const yearData = await Year.findOne({ year });
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
      let setBudget = budget > remainingBudget ? remainingBudget : budget;
      // check if there already exists an envelope for this category
      let envelope;
      const existingEnvelope = await Envelope.findOne({ category, monthId: month._id });
      if (existingEnvelope) {
        envelope = await Envelope.findByIdAndUpdate(existingEnvelope._id, { $set: { budget: setBudget }});
        setBudget -= existingEnvelope.budget;
      } else {
        envelope = new Envelope({ category, budget: setBudget, monthId: month._id });
        await envelope.save();
      }
      newEnvelopes.push({ [month.month]: envelope });
      updateDocument["$inc"][`months.${index}.allocatedBudget`] = setBudget;
    }
  }

  const updatedYear = await Year.findOneAndUpdate(
    { year: year },
    updateDocument,
    { new: true, upsert: true }
  );
  return {
    updatedYear,
    newEnvelopes
  };
};

/**
 * @description UPDATE ENVELOPE BY ENVELOPE ID
 * @param {Object} req.body - Needs to have envelope info included
 * @param {ObjectId} req.body.id - mongodb _id of envelope
 * @param {Object} req.body.data - envelope info to update
 * @returns {Promise<Envelope>}
 */
const updateEnvelopeById = async (envelopeId, updateData) => {
  const envelope = Envelope.findById(envelopeId);
  if (!envelope) {
    throw new ApiError(httpStatus.NOT_FOUND, "Envelope not found");
  }
  Object.assign(envelope, updateData);
  await envelope.save();
  return envelope;
};

/**
 * @description UPDATE ENVELOPES BY SELECTED MONTH(S) AND ENVELOPE CATEGORY
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are updating envelopes for
 * @param {Object} req.body.envelope - envelope object containing updated info
 * @param {Array} req.body.monthIds - Array of numerical monthId's to update envelopes for
 * @param {Array} req.body.envelopes - Array of existing envelope objects
 * @return {{updatedYear: Promise<Year>, newEnvelopes: Array<Envelope>}}
 */
const updateEnvelopes = async ({ year, category, budget, monthIds, envelopes }) => {
  const newEnvelopes = [];
  const yearData = await Year.findOne({ year });
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
      const currentEnvelope = envelopes.find((el) => el.monthId === month._id.toString() && el.category === category);
      const remainingBudget = month.budget - month.allocatedBudget;
      // If we attempt to allocate more than available, set amount equal to the monthly budget total
      const setBudget = budget - currentEnvelope.budget > remainingBudget ? remainingBudget : budget;
      const envelope = await Envelope.findOneAndUpdate(
        { category, monthId: month._id },
        { $set: { budget: setBudget }},
        { new: true }
      );
      updateDocument["$inc"][`months.${index}.allocatedBudget`] = setBudget - currentEnvelope.budget;
      newEnvelopes.push({ [month.month]: envelope });
    }
  }

  const updatedYear = await Year.findOneAndUpdate(
    { year: year },
    updateDocument,
    { new: true, upsert: true }
  );
  return {
    updatedYear,
    newEnvelopes
  };
};

/**
 * @description DELETE ENVELOPE BY ENVELOPE ID
 * @param {Object} req.body - Needs to have envelope info included
 * @param {ObjectId} envelopeId - mongodb _id of envelope
 * @returns {{Promise<Envelope>, Promise<Year>}}
 */
const deleteEnvelopeById = async ({ envelopeId }) => {
  const envelope = await Envelope.findByIdAndDelete(envelopeId);
  if (!envelope) {
    throw new ApiError(httpStatus.NOT_FOUND, "Envelope not found");
  }
  // for some reason there isn't a @subtract of @decrement...so we add the negative value to decrease the value of allocatedBudget
  const updateDocument = {
    $inc: { "months.$.allocatedBudget": Number(envelope.budget) * -1 },
  };
  const options = {
    new: true,
  };
  const updatedYear = await Year.findOneAndUpdate(
    { "months._id": envelope.monthId },
    updateDocument,
    options
  );
  return {
    envelope,
    updatedYear,
  };
};

/**
 * @description DELETE ENVELOPES BY MONTH
 * @param {number} year - numerical value of year we are deleting envelopes for
 * @param {string} category - envelope category
 * @param {Array<ObjectId>} monthIds - Array of numerical mongoDb monthId's to delete envelopes for
 * @returns {{Promise<Envelope>, Promise<Year>}}
 */
// eslint-disable-next-line no-unused-vars
const deleteEnvelopes = async ({ year, category, monthIds }) => {
  /* 
    this route should 
      - receive an array of monthIds
      - receive an envelope name
      - delete all envelopes of same name of included monthIds
  */
  throw new ApiError(httpStatus.NOT_IMPLEMENTED);
};

/**
 * @description DELETE ALL ENVELOPES ACROSS ALL YEARS
 * @returns {{Promise<Envelope>, Promise<Year>}}
 */
const deleteAllEnvelopes = async () => {
  const envelopes = await Envelope.deleteMany();
  if (!envelopes) {
    throw new ApiError(httpStatus.NOT_FOUND, "Envelopes not found");
  }
  // now handle all the years
  const updateDocument = {
    $set: { "months.$[].allocatedBudget": 0 },
  };
  const options = {
    new: true,
  };
  const updatedYear = await Year.updateMany({}, updateDocument, options);
  return {
    envelopes,
    updatedYear,
  };
};

module.exports = {
  getEnvelopeById,
  getEnvelopeByMonthId,
  getEnvelopeByCategory,
  createEnvelope,
  updateEnvelopeById,
  updateEnvelopes,
  deleteEnvelopeById,
  deleteEnvelopes,
  deleteAllEnvelopes,
};
