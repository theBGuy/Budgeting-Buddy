const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const envelopeService = require("../services/envelope.service");

/**
 * @description GET ENVELOPE BY ENVELOPE ID
 * @param {ObjectId} envelopeId - mongodb _id
 */
const getEnvelopeById = catchAsync(async (req, res) => {
  if (req.params.envelopeId === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument");
  }
  const data = await envelopeService.getEnvelopeById(req.params.envelopeId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Envelope not found");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description GET ENVELOPES BY MONTH ID
 * @param {ObjectId} monthId - mongodb _id
 */ 
const getEnvelopeByMonthId = catchAsync(async (req, res) => {
  if (req.params.monthId === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument");
  }
  const data = await envelopeService.getEnvelopeByMonthId(req.params.monthId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Envelope not found");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description GET ENVELOPES BY CATEGORY
 * @param {string} category
 */
const getEnvelopeByCategory = catchAsync(async (req, res) => {
  if (req.params.category === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument");
  }
  const data = await envelopeService.getEnvelopeByCategory(req.params.category);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Envelope not found");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description Create new envelopes for array of month ids
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are adding envelopes to
 * @param {string} req.body.category - string description of envelope category
 * @param {number} req.body.budget - numerical value of of allocated budget for envelope
 * @param {Array} req.body.monthIds - Array of numerical monthId's to create envelopes for
 */
const createEnvelope = catchAsync(async (req, res) => {
  const { year, category, budget, monthIds } = req.body;
  if ([year, category, budget, monthIds].some(el => el === undefined)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument(s)");
  }
  if (!monthIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing months for envelope(s)");
  }
  const data = await envelopeService.createEnvelope(req.body);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to create envelope(s)");
  }
  res.status(httpStatus.CREATED).json(data);
});

/**
 * @description UPDATE ENVELOPE BY ENVELOPE ID
 * @param {Object} req.body - Needs to have envelope info included
 * @param {ObjectId} envelopeId - mongodb _id of envelope
 * @param {Object} req.body.data - envelope info to update
 */ 
const updateEnvelopeById = catchAsync(async (req, res) => {
  if (req.params.envelopeId === undefined || req.body.data === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument");
  }
  const data = await envelopeService.updateEnvelopeById(req.params.envelopeId, req.body.data);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to update envelope");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description UPDATE ENVELOPES BY SELECTED MONTHS AND ENVELOPE NAME
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are updating envelopes for
 * @param {Object} req.body.envelope - envelope object containing updated info
 * @param {Array} req.body.monthIds - Array of numerical monthId's to update envelopes for
 * @param {Array} req.body.envelopes - Array of existing envelope objects
 */
const updateEnvelopes = catchAsync(async (req, res) => {
  const { year, category, budget, monthIds, envelopes } = req.body;
  if ([year, category, budget, monthIds, envelopes].some(el => el === undefined)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument(s)");
  }
  if (!monthIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing months for envelope(s)");
  }
  if (!envelopes.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing envelopes");
  }
  const data = await envelopeService.updateEnvelopes(req.body);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to update envelope(s)");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description DELETE ENVELOPE BY ENVELOPE ID
 * @param {Object} req.body - Needs to have envelope info included
 * @param {ObjectId} req.body.envelopeId - mongodb _id of envelope
 */ 
const deleteEnvelopeById = catchAsync(async (req, res) => {
  const { envelopeId } = req.body;
  if (envelopeId === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing request body argument(s)");
  }
  const data = await envelopeService.deleteEnvelopeById({ envelopeId });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to delete envelope");
  }
  res.status(httpStatus.OK).json({ ...data, success: true });
});

/**
 * @description DELETE ENVELOPES BY MONTH
 * @param {Object} req.body - Needs to have envelope info included
 * @param {number} req.body.year - numerical value of year we are deleting envelopes for
 * @param {string} req.body.category - envelope category
 * @param {Array} req.body.monthIds - Array of numerical monthId's to delete envelopes for
 */
// eslint-disable-next-line no-unused-vars
const deleteEnvelopes = catchAsync(async (req, res) => {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED);
});

/**
 * @description DELETE ALL ENVELOPES ACROSS ALL YEARS
 */ 
const deleteAllEnvelopes = catchAsync(async (req, res) => {
  const data = await envelopeService.deleteAllEnvelopes();
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to delete envelopes");
  }
  res.status(httpStatus.OK).json({ ...data, success: true });
});

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