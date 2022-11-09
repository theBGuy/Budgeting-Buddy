require("dotenv").config({ path: "./config.env" });
const {connection, dropCollections} = require("./dbFunctions");

(async () => {
  await dropCollections();
  await connection.close();
})();