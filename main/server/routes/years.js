const yearsRouter = require("express").Router();
const { Year } = require("../models/year");
const { Month } = require("../models/month");
const { Envelope } = require("../models/envelope");

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
/** POST ROUTES */
/**
 * Create a new year
 */
yearsRouter.post("/createYear", async (req, res) => {
  try {
    const dataToSave = await createYear(req.body);
    const success = dataToSave ? true : false;
    res.status(200).json({ success });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * Create a new envelope for a specific month
 * @param {number} year - year to get
 * @param {string} month - name of month
 * @param {object} body - monthId (needs to be _id of month), category (any string), budget (number)
 */
yearsRouter.post("/:year/:month/add", async (req, res) => {
  try {
    const { monthId, category, budget } = req.body;
    const envelope = new Envelope({
      category: category,
      budget: budget,
      monthId,
    });
    await envelope.save();
    const incAmount = Number(budget);
    const decAmount = incAmount * -1;
    const updateDocument = {
      $push: { "months.$[months].envelopes": envelope._id },
      $inc: {
        remaining: decAmount,
        spent: incAmount,
        "months.$[months].remaining": decAmount,
        "months.$[months].spent": incAmount,
      },
    };
    const options = {
      arrayFilters: [
        {
          "months.month": req.params.month,
        },
      ],
    };
    await Year.findOneAndUpdate({ year: req.params.year }, updateDocument, options);
    res.status(200).json();
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/** GET ROUTES */
/**
 * Get all year documents
 */
yearsRouter.get("/", async (req, res) => {
  try {
    const data = await Year.find().sort({ year: 1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Get year by number
 */
yearsRouter.get("/:year", async (req, res) => {
  try {
    const year = req.params.year;
    const data = await Year.findOne({ year: year });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Get months of a year
 */
yearsRouter.get("/:year/months", async (req, res) => {
  try {
    const year = req.params.year;
    const data = await Year.findOne({ year: year });
    res.json(data.months);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Get month of a year
 */
yearsRouter.get("/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;
    const projection = {
      months: { $elemMatch: { month: month } },
    };
    const data = await Year.findOne({ year: year }, projection);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Get all envelopes id's of a month of a year
 */
yearsRouter.get("/:year/:month/allId", async (req, res) => {
  try {
    const { year, month } = req.params;
    const projection = {
      months: { $elemMatch: { month: month } },
    };
    const data = await Year.findOne({ year: year }, projection);
    res.json(data.months[0].envelopes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Get all envelopes of a month of a year
 */
yearsRouter.get("/:year/:monthId/all", async (req, res) => {
  try {
    const { monthId } = req.params;
    const data = await Envelope.find({ month: monthId });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** PATCH ROUTES */
/**
 * Update select year main properties. Use negative value to decrease a value by that amount
 */
yearsRouter.patch("/:year", async (req, res) => {
  try {
    const { budget, remaining, spent } = req.body;
    const updateDocument = {
      $inc: {
        budget: Number(budget || 0),
        remaining: Number(remaining || 0),
        spent: Number(spent || 0),
      },
    };
    const updated = await Year.findOneAndUpdate(
      { year: Number(req.params.year) },
      updateDocument,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Update all months of select year
 */
yearsRouter.patch("/:year/all", async (req, res) => {
  try {
    const updateDocument = {
      $inc: { "months.$[].budget": Number(req.body.amount || 0) },
    };
    const updated = await Year.updateMany(
      { year: Number(req.params.year) },
      updateDocument
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

yearsRouter.patch("/:year/:month", async (req, res) => {
  try {
    const updateDocument = {
      $inc: { "months.$[months].budget": Number(req.body.amount || 0) },
    };
    const options = {
      arrayFilters: [
        {
          "months.month": req.params.month,
        },
      ],
    };
    const updated = await Year.updateOne(
      { year: Number(req.params.year) },
      updateDocument,
      options
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** DELETE ROUTES */
/**
 * Delete all year documents
 */
yearsRouter.delete("/all", async (req, res) => {
  try {
    const data = await Year.deleteMany();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Delete year by number
 */
yearsRouter.delete("/:year", async (req, res) => {
  try {
    const year = req.params.year;
    const data = await Year.deleteOne({ year: year });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Delete envelope from month by id
 */
yearsRouter.delete("/:year/:month/:id", async (req, res) => {
  try {
    const { year, month, id } = req.params;
    const envelope = await Envelope.findOneAndDelete({ _id: id });
    const incAmount = envelope.budget;
    const decAmount = envelope.budget * -1;
    const updateDocument = {
      $pull: { "months.$[months].envelopes": id },
      $inc: {
        remaining: incAmount,
        spent: decAmount,
        "months.$[months].remaining": incAmount,
        "months.$[months].spent": decAmount,
      },
    };
    const options = {
      arrayFilters: [
        {
          "months.month": month,
        },
      ],
    };
    const data = await Year.findOneAndUpdate({ year: year }, updateDocument, options);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = yearsRouter;
