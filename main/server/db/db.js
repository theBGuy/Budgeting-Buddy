const mongoose = require("mongoose");
mongoose.set("autoCreate", false);
mongoose.connect(process.env.ATLAS_URI);
require("deasync").loopWhile(function () {
  return mongoose.connection.readyState !== 1;
});
const connection = mongoose.connection;
const db = connection.db;
module.exports = {connection, db};



