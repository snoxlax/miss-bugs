import { msgService } from '../services/msg.service.js';

export async function getMsgs(req, res) {
  try {
    const filterBy = req.query.filterBy ? JSON.parse(req.query.filterBy) : {};
    const msgs = await msgService.query(filterBy);
    res.json(msgs);
  } catch (e) {
    console.error('error in server:', e);
    res.status(400).send('Msgs not found');
  }
}

export async function saveMsg(req, res) {
  try {
    const user = req.currentUser;
    if (!user) return res.status(401).send('Not authorized');

    const msgToSave = req.body;
    const msg = await msgService.save(msgToSave, user);
    res.json(msg);
  } catch (e) {
    console.error('error in server:', e);
    res.status(400).send('Saving msg failed');
  }
}

export async function removeMsg(req, res) {
  try {
    const user = req.currentUser;
    if (!user?.isAdmin) return res.status(401).send('Not authorized');

    const { msgId } = req.params;
    await msgService.remove(msgId);
    res.send(`Removed ID ${msgId} successfully`);
  } catch (e) {
    console.error('error in server:', e);
    res.status(400).send("Couldn't remove msg");
  }
}
