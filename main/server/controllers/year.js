const { Year } = require("../models/year");
const { Month } = require("../models/month");

async function createYear(info) {
  if (info.months === undefined) throw new Error("Not enough information provided");
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

module.exports = { createYear };