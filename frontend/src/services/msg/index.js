import { msgService as remoteMsgService } from './msg.service.remote.js';

// For now, only use remote service
// Can add local service later if needed
export const msgService = remoteMsgService;
