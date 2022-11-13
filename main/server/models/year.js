const mongoose = require("mongoose");
const { monthSchema, Month } = require("./month");

const yearSchema = new mongoose.Schema(
  {
    year: {
      required: true,
      type: Number,
    },
    budget: {
      required: true,
      type: Number,
    },
    remaining: {
      required: true,
      type: Number,
    },
    spent: {
      type: Number,
      default: 0,
    },
    months: [monthSchema],
  },
  {
    methods: {
      async createYear(info) {
        if (info.months === undefined) throw new Error("Not enough information provided");
        console.log(info);
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
      },
    },
  }
);

const Year = mongoose.model("Year", yearSchema);

module.exports = { Year };
