import { ObjectId } from 'mongodb';

export function buildId(id) {
  if (!id) return id;
  if (id instanceof ObjectId) return id;
  if (typeof id === 'object' && id._id) return buildId(id._id);
  if (typeof id !== 'string') return id;
  try {
    return ObjectId.createFromHexString(id);
  } catch {
    return id;
  }
}
