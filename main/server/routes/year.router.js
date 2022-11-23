const yearRouter = require("express").Router();
const yearController = require("../controllers/year.controller");

/** POST ROUTES */
/**
 * @description Create a new year
 */
yearRouter.post("/createYear", yearController.createYear);

/** GET ROUTES */
/**
 * @description Get all year documents
 */
yearRouter.get("/", yearController.getYears);

/**
 * @description Get year by number
 * @param {number} year
 */
yearRouter.get("/:year([0-9]+)", yearController.getYear);

/**
 * @description Get all months of a year
 * @param {number} year
 */
yearRouter.get("/:year([0-9]+)/months", yearController.getMonths);

/**
 * @description Get month of a year
 * @param {number} year
 * @param {string} month - name of month to get
 */
yearRouter.get("/:year([0-9]+)/:month([A-Za-z]+)", yearController.getMonth);

/** PATCH ROUTES */
/**
 * @description Update select year
 * @param {number} year
 */
yearRouter.patch("/updateYear/:year([0-9]+)", yearController.updateYear);

/** DELETE ROUTES */
/**
 * @description Delete all year documents
 */
yearRouter.delete("/all", yearController.deleteAllYears);

/**
 * @description Delete year
 * @param {number} year
 */
yearRouter.delete("/:year([0-9]+)", yearController.deleteYear);

module.exports = yearRouter;
