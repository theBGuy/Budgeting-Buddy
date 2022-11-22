const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = "development";
}

require("dotenv").config({ path: "./config.env" });
const envelopesRoutes = require("./routes/envelopes");
const yearsRoutes = require("./routes/years");

const logger = require("./utils/logger");
const morganMiddleware = require("./middlewares/morgan.middleware");
const { invalidPathHandler, errorConverter, errorHandler } = require("./utils/errorHandling");

const app = express();
const port = process.env.PORT || 5001;


// set-up middlewares
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

app.use("/envelopes", envelopesRoutes);
app.use("/years", yearsRoutes);

/**
  @error-handling
   - invalidPathHandler: send back a 404 error for any unknown api request
   - errorConverter: convert error to ApiError, if needed
   - errorHandler: handle the error
 */
app.use(invalidPathHandler);
app.use(errorConverter);
app.use(errorHandler);

// connect to the db
mongoose
  .connect(process.env.ATLAS_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("db Connected");
    // db connected, now start listening
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  })
  .catch((e) => {
    logger.error("Unable to connect to MongoDB Atlas!");
    logger.error(e);
    process.exit(1);
  });
