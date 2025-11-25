import { dbService } from './db.service.js';
import { buildId } from '../utils/mongo.utils.js';

const collectionName = 'msg';

export const msgService = {
  query,
  remove,
  save,
};

async function query(filterBy = {}) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const criteria = _buildCriteria(filterBy);

    const pipeline = [
      { $match: criteria },
      {
        $lookup: {
          from: 'bug',
          localField: 'aboutBugId',
          foreignField: '_id',
          as: 'aboutBug',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'byUserId',
          foreignField: '_id',
          as: 'byUser',
        },
      },
      {
        $unwind: {
          path: '$aboutBug',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$byUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          txt: 1,
          aboutBugId: 1,
          byUserId: 1,
          aboutBug: {
            _id: '$aboutBug._id',
            title: '$aboutBug.title',
            severity: '$aboutBug.severity',
          },
          byUser: {
            _id: '$byUser._id',
            fullname: '$byUser.fullname',
            username: '$byUser.username',
          },
        },
      },
    ];

    const msgs = await collection.aggregate(pipeline).toArray();
    return msgs;
  } catch (e) {
    console.error('error in msg service:', e);
    throw new Error(e);
  }
}

async function remove(msgId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const criteria = { _id: buildId(msgId) };
    const { deletedCount } = await collection.deleteOne(criteria);
    if (!deletedCount) throw new Error('Id not found in remove');
    return deletedCount;
  } catch (e) {
    console.error('error in msg service:', e);
    throw new Error(e);
  }
}

async function save(msgToSave, user) {
  try {
    const collection = await dbService.getCollection(collectionName);

    const msgToPersist = {
      txt: msgToSave.txt,
      aboutBugId: buildId(msgToSave.aboutBugId),
      byUserId: buildId(user._id),
    };

    let savedMsg;
    if (msgToSave._id) {
      const msgId = buildId(msgToSave._id);
      const { matchedCount } = await collection.updateOne(
        { _id: msgId },
        { $set: msgToPersist }
      );
      if (!matchedCount) throw new Error('Id not found in save');
      savedMsg = await collection.findOne({ _id: msgId });
    } else {
      const { insertedId } = await collection.insertOne(msgToPersist);
      savedMsg = await collection.findOne({ _id: insertedId });
    }

    return savedMsg;
  } catch (e) {
    console.error('error in msg service:', e);
    throw new Error(e);
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.aboutBugId) {
    criteria.aboutBugId = buildId(filterBy.aboutBugId);
  }
  if (filterBy.byUserId) {
    criteria.byUserId = buildId(filterBy.byUserId);
  }
  return criteria;
}
