require("dotenv").config({ path: "./config.env" });
const {connection, dropCollections, createCollections} = require("./dbFunctions");

async function resetCollections() {
  await dropCollections();
  await createCollections();
  await connection.close();
}

resetCollections();