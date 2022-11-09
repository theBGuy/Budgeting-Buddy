const yearRouter = require('express').Router();
const { Year } = require('../models/year');
const { Month } = require('../models/month');
const { Envelope } = require('../models/envelope');
// const mongoose = require("mongoose");

async function createMonths(budget) {
  const monthsArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const months = await Promise.all(
    monthsArr.map(async (monthString) => {
      const month = new Month({
        month: monthString,
        budget,
        remaining: budget,
      });
      return month;
    })
  );
  return months;
}

async function createYear(n, budget = 0) {
  const perMonth = budget > 0 ? Math.floor(budget / 12) : 0;
  const months = await createMonths(perMonth);
  const year = new Year({ year: n, budget, remaining: budget, months });
  await year.save();
  return year;
}

/** POST ROUTES */
/**
 * Create a new year
 */
yearRouter.post('/add', async (req, res) => {
  try {
    const dataToSave = createYear(req.body.year, req.body.budget);
    res.status(200).json(dataToSave);
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
yearRouter.post('/:year/:month/add', async (req, res) => {
  try {
    const { monthId, category, budget } = req.body;
    const envelope = new Envelope({
      month: monthId,
      category: category,
      budget: budget,
    });
    await envelope.save();
    const incAmount = Number(budget);
    const decAmount = incAmount * -1;
    const updateDocument = {
      $push: { 'months.$[months].envelopes': envelope._id },
      $inc: {
        remaining: decAmount,
        spent: incAmount,
        'months.$[months].remaining': decAmount,
        'months.$[months].spent': incAmount,
      },
    };
    const options = {
      arrayFilters: [
        {
          'months.month': req.params.month,
        },
      ],
    };
    await Year.findOneAndUpdate(
      { year: req.params.year },
      updateDocument,
      options
    );
    res.status(200).json();
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/** GET ROUTES */
/**
 * Get all year documents
 */
yearRouter.get('/all', async (req, res) => {
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
yearRouter.get('/:year', async (req, res) => {
  try {
    const year = req.params.year;
    const data = await Year.find({ year: year });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Get months of a year
 */
yearRouter.get('/:year/months', async (req, res) => {
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
yearRouter.get('/:year/:month', async (req, res) => {
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
yearRouter.get('/:year/:month/allId', async (req, res) => {
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
yearRouter.get('/:year/:monthId/all', async (req, res) => {
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
yearRouter.patch('/:year', async (req, res) => {
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
yearRouter.patch('/:year/all', async (req, res) => {
  try {
    const updateDocument = {
      $inc: { 'months.$[].budget': Number(req.body.amount || 0) },
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

yearRouter.patch('/:year/:month', async (req, res) => {
  try {
    const updateDocument = {
      $inc: { 'months.$[months].budget': Number(req.body.amount || 0) },
    };
    const options = {
      arrayFilters: [
        {
          'months.month': req.params.month,
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
yearRouter.delete('/all', async (req, res) => {
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
yearRouter.delete('/:year', async (req, res) => {
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
yearRouter.delete('/:year/:month/:id', async (req, res) => {
  try {
    const { year, month, id } = req.params;
    const envelope = await Envelope.findOneAndDelete({ _id: id });
    const incAmount = envelope.budget;
    const decAmount = envelope.budget * -1;
    const updateDocument = {
      $pull: { 'months.$[months].envelopes': id },
      $inc: {
        remaining: incAmount,
        spent: decAmount,
        'months.$[months].remaining': incAmount,
        'months.$[months].spent': decAmount,
      },
    };
    const options = {
      arrayFilters: [
        {
          'months.month': month,
        },
      ],
    };
    const data = await Year.findOneAndUpdate(
      { year: year },
      updateDocument,
      options
    );
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// const data = await Year.find({ year: 2023 });
// await data.forEach(doc => doc.months.forEach(month => console.log(`Month: ${month.month}, total: ${month.total}`)));
// await data.forEach(doc => doc.months.forEach((month, index) => {
//   doc.months[index].total += 1000;
// }));
// await data.forEach(doc => doc.months.forEach(month => console.log(`Month: ${month.month}, total: ${month.total}`)));

// yearRouter.post("/findMonths", async (req, res) => {
//   try {
//     const monthIds = req.body.monthIds.map(id => mongoose.Types.ObjectId(id));
//     console.log("monthIds", monthIds);
//     console.log("hit");
//     const foundMonths = await Year.aggregate(aggregateFilterByInArr({year: 2022}, "months", "_id", monthIds));
//     console.log("foundMonths", foundMonths);
//     res.send(foundMonths);
//   } catch (e) {
//     res.status(500).json({message: e.message });
//   }
// });

// function aggregateFilterByInArr(matchObj, inputName, key, arr) {
//   return [
//     {$match: matchObj},
//     {
//       $project: {
//         "filtered": {
//           $filter: {
//             "input": `$${inputName}`,
//             "as": "x",
//             "cond": {"$in": [`$$x.${key}`, arr]}
//           }
//         }
//       }
//     }
//   ];
// }

module.exports = yearRouter;
