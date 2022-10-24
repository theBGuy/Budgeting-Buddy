const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const envelopeRoutes = require("./routes/envelope");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/envelope", envelopeRoutes);

// connect to the db
mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  })
  .then(() => console.log("db Connected"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});