import { dbService } from './db.service.js';
import { ObjectId } from 'mongodb';
import { buildId } from '../utils/mongo.utils.js';

const collectionName = 'user';

export const userService = {
  findAll,
  findById,
  findByUsername,
  create,
  update,
  remove,
};

async function findAll() {
  try {
    const collection = await dbService.getCollection(collectionName);
    return await collection.find().toArray();
  } catch (e) {
    console.error('error in user service:', e);
    throw new Error(e);
  }
}

async function findById(id) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const userId = buildId(id);
    const user = await collection.findOne({ _id: userId });
    return user || null;
  } catch (e) {
    console.error('error in user service:', e);
    throw new Error(e);
  }
}

async function findByUsername(username) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const user = await collection.findOne({ username });
    return user || null;
  } catch (e) {
    console.error('error in user service:', e);
    throw new Error(e);
  }
}

async function create(data) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const userToInsert = {
      username: data.username,
      fullname: data.fullname,
      password: data.password,
      score: data.score || 0,
      isAdmin: data.isAdmin || false,
    };

    const { insertedId } = await collection.insertOne(userToInsert);
    const newUser = await collection.findOne({ _id: insertedId });
    return newUser;
  } catch (e) {
    console.error('error in user service:', e);
    throw new Error(e);
  }
}

async function update(id, data) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const userId = buildId(id);
    const userToUpdate = {
      username: data.username,
      fullname: data.fullname,
      password: data.password,
      score: data.score,
      isAdmin: data.isAdmin,
    };

    const { matchedCount } = await collection.updateOne(
      { _id: userId },
      { $set: userToUpdate }
    );

    if (!matchedCount) return null;

    const updatedUser = await collection.findOne({ _id: userId });
    return updatedUser;
  } catch (e) {
    console.error('error in user service:', e);
    throw new Error(e);
  }
}

async function remove(id) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const userId = buildId(id);
    const { deletedCount } = await collection.deleteOne({ _id: userId });
    return deletedCount > 0;
  } catch (e) {
    console.error('error in user service:', e);
    throw new Error(e);
  }
}
