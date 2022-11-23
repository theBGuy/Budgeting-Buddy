const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const yearService = require("../services/year.service");

/**
 * @description Create new year
 * @param {Object} req.body - Year info
 * @param {number} req.body.year - numerical value of year we are creating
 * @param {number} req.body.budget - numerical value of of allocated budget for year
 * @param {Object} req.body.months - Object containing all months
 */
const createYear = catchAsync(async (req, res) => {
  const { year, budget, months } = req.body;
  if ([year, budget, months].some(el => el === undefined)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing body argument(s)");
  }
  if (!Object.keys(months).length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing months");
  }
  const data = await yearService.createYear(req.body);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to create year");
  }
  res.status(httpStatus.CREATED).json(data);
});

/**
 * @description GET ALL YEARS
 */
const getYears = catchAsync(async (req, res) => {
  const data = await yearService.getYears();
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to find years");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description GET SINGLE YEAR BY YEAR
 * @param {number} year
 */
const getYear = catchAsync(async (req, res) => {
  if (req.params.year === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument");
  }
  const data = await yearService.getYear(req.params);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Year not found");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description GET MONTHS OF A YEAR
 * @param {number} year
 */
const getMonths = catchAsync(async (req, res) => {
  if (req.params.year === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument");
  }
  const data = await yearService.getYear(req.params);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Year not found");
  }
  res.status(httpStatus.OK).json(data.months);
});

/**
 * @description GET MONTH OF A YEAR
 * @param {number} year
 * @param {string} month - name of month to get
 */
const getMonth = catchAsync(async (req, res) => {
  if (req.params.year === undefined || req.params.month === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument(s)");
  }
  const data = await yearService.getMonth(req.params);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Year not found");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description UPDATE YEAR
 * @param {number} req.params.year - numerical value of year we are looking for
 * @param {Array<Month>} req.body.months - Array of months in year
 * @param {number} req.body.budget - numerical value of allocated budget for year
 */
const updateYear = catchAsync(async (req, res) => {
  const { year, months, budget } = { ...req.params, ...req.body };
  if ([year, months, budget].some(el => el === undefined)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument(s)");
  }
  const data = await yearService.updateYear({ year, months, budget });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to update year");
  }
  res.status(httpStatus.OK).json(data);
});

/**
 * @description DELETE ALL YEARS
 */ 
const deleteAllYears = catchAsync(async (req, res) => {
  const data = await yearService.deleteAllYears();
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to delete years");
  }
  res.status(httpStatus.OK).json({ ...data, success: true });
});

/**
 * @description DELETE YEAR
 * @param {number} req.params.year - numerical value of year we are looking for
 */
const deleteYear = catchAsync(async (req, res) => {
  if (req.params.year === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing parameter argument(s)");
  }
  const data = await yearService.deleteYear(req.params);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to delete years");
  }
  res.status(httpStatus.OK).json({ ...data, success: true });
});

module.exports = {
  createYear,
  getYears,
  getYear,
  getMonths,
  getMonth,
  updateYear,
  deleteAllYears,
  deleteYear,
};