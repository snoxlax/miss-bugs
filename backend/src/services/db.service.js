import { MongoClient } from 'mongodb';
import { config } from '../config/index.js';

export const dbService = { getCollection };

var dbConn = null;

async function getCollection(collectionName) {
  try {
    const db = await _connect();
    const collection = await db.collection(collectionName);
    return collection;
  } catch (err) {
    console.error('Failed to get Mongo collection', err);
    throw err;
  }
}

async function _connect() {
  if (dbConn) return dbConn;

  try {
    const client = await MongoClient.connect(config.database.url);
    dbConn = client.db(config.database.name);
    console.log('Connected to MongoDB:', config.database.name);
    return dbConn;
  } catch (err) {
    console.error('Cannot Connect to DB', err);
    throw err;
  }
}
