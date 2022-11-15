const yearsRouter = require("express").Router();
const { Year } = require("../models/year");
const { createYear } = require("../controllers/year");

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

/** GET ROUTES */
/**
 * @description Get all year documents
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
 * @description Get year by number
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
 * @description Get all months of a year
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
 * @description Get month of a year
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

/** PATCH ROUTES */
/**
 * @description Update select year
 */
yearsRouter.patch("/updateYear/:year", async (req, res) => {
  try {
    const { budget, months } = req.body;
    const updateDocument = {
      $set: {
        budget: Number(budget || 0),
      },
    };
    Object.keys(months).forEach((month, index) => {
      updateDocument["$set"][`months.${index}.budget`] = Number(months[month].budget || 0);
    });
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
 * @deprecated - think this can be removed but leaving it for now
 * @description Update all months of select year
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

/**
 * @deprecated - think this can be removed but leaving it for now
 * @description Update month of select year
 */
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
 * @description Delete all year documents
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
 * @description Delete year
 */
yearsRouter.delete("/deleteYear/:year", async (req, res) => {
  try {
    const year = req.params.year;
    const data = await Year.deleteOne({ year: year });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = yearsRouter;
