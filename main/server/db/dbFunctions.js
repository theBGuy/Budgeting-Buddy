const {connection, db} = require("./db");
const {Envelope} = require("../models/envelope");
const {Year} = require("../models/year");

const models = [Envelope, Year];

async function getCollectionNames() {
  const collections = await db.collections();
  const collectionNames = collections.map(collection => collection.s.namespace.collection);
  return collectionNames;
}

async function dropCollections() {
  const collectionNames = await getCollectionNames();
  for (const collectionName of collectionNames) {
    await db.dropCollection(collectionName);
  }
  const updatedCollectionNames = await getCollectionNames();
  console.log("collections: ", updatedCollectionNames);
}

async function createCollections() {
  for (const model of models) {
    await model.createCollection();
  }
  const updatedCollectionNames = await getCollectionNames();
  console.log("collections: ", updatedCollectionNames);
}

module.exports = {connection, dropCollections, createCollections};

