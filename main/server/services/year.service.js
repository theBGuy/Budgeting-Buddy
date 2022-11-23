const httpStatus = require("http-status");
const { Year } = require("../models/year");
const { Month } = require("../models/month");
const { Envelope } = require("../models/envelope");
const ApiError = require("../utils/ApiError");

async function newYear(info) {
  if (info.months === undefined) throw new ApiError(httpStatus.BAD_REQUEST, "Missing body argument(s)");
  const months = Object.keys(info.months).map((monthInfo) => {
    const newMonth = new Month({
      month: monthInfo,
      budget: info.months[monthInfo].budget,
      remaining: info.months[monthInfo].budget,
    });
    return newMonth;
  });
  const year = new Year({
    year: info.year,
    budget: info.budget,
    remaining: info.budget,
    months,
  });
  await year.save();
  return year;
}

/**
 * @description CREATE NEW YEAR
 * @param {number} year - numerical value of year we are creating
 * @param {number} budget - numerical value of allocated budget for year
 *
 * @typedef month - Month containing budget info
 * @type {Object}
 * @property {number} budget - numerical value of allocated budget for month
 *
 * @typedef months - Object containing all months
 * @type {Object}
 * @property {Object.<month>} month - key name of associated month
 *
 * @param {Object.<months>} months - Object containing all months
 * @return {Promise<Year>}
 */
const createYear = async ({ year, budget, months }) => {
  const data = await newYear({ year, budget, months });
  return data;
};

/**
 * @description GET ALL YEARS
 * @returns {Promise<Year>}
 */
const getYears = async () => {
  return Year.find().sort({ year: 1 });
};

/**
 * @description GET SINGLE YEAR BY YEAR
 * @param {number} year - numerical value of year we are looking for
 * @returns {Promise<Year>}
 */
const getYear = async ({ year }) => {
  return Year.findOne({ year });
};

/**
 * @description GET MONTH OF A YEAR
 * @param {number} year - numerical value of year we are looking for
 * @param {string} month - name of month
 * @returns {Promise<Year>}
 */
const getMonth = async ({ year, month }) => {
  const projection = {
    months: { $elemMatch: { month: month } },
  };
  return Year.findOne({ year }, projection);
};

/**
 * @description UPDATE YEAR
 * @param {number} year - numerical value of year we are looking for
 * @param {Array<Month>} months - Array of months in year
 * @param {number} budget - numerical value of allocated budget for year
 * @returns {Promise<Year>}
 */
const updateYear = async ({ year, months, budget }) => {
  const updateDocument = {
    $set: {
      budget: Number(budget || 0),
    },
  };
  Object.keys(months).forEach((month, index) => {
    updateDocument["$set"][`months.${index}.budget`] = Number(months[month].budget || 0);
  });
  return Year.findOneAndUpdate(
    { year },
    updateDocument,
    { new: true, upsert: true }
  );
};

/**
 * @deprecated - think this can be removed but leaving it for now
 * @description UPDATE MONTH OF A YEAR
 * @param {number} year - numerical value of year we are looking for
 * @param {string} month - name of month
 * @param {number} budget - numerical value of allocated budget for month
 * @returns {Promise<Year>}
 */
const updateMonth = async ({ year, month, budget }) => {
  const updateDocument = {
    $inc: { "months.$[months].budget": Number(budget || 0) },
  };
  const options = {
    arrayFilters: [
      {
        "months.month": month,
      },
    ],
  };
  return Year.updateOne(
    { year },
    updateDocument,
    options
  );
};

/**
 * @description DELETE ALL YEARS
 * @returns {{Promise<Envelope>, Promise<Year>}}
 */
const deleteAllYears = async () => {
  const years = await Year.deleteMany();
  if (!years) {
    throw new ApiError(httpStatus.NOT_FOUND, "Years not found");
  }
  const envelopes = await Envelope.deleteMany();
  return {
    years,
    envelopes,
  };
};

/**
 * @description DELETE YEAR
 * @param {number} year - numerical value of year we are looking for
 * @returns {{Promise<Envelope>, Promise<Year>}}
 */
const deleteYear = async ({ year }) => {
  const yearData = await Year.findOneAndDelete({ year });
  if (!yearData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Year not found");
  }
  const monthIds = yearData.months.map((month) => month._id);
  const envelopes = await Envelope.deleteMany({ monthId: { $in: monthIds }});
  return {
    yearData,
    envelopes,
  };
};

module.exports = {
  createYear,
  getYears,
  getYear,
  getMonth,
  updateYear,
  updateMonth,
  deleteAllYears,
  deleteYear,
};