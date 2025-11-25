import { useEffect, useState } from 'react';
import { msgService } from '../services/msg/index.js';
import { authService } from '../services/auth/index.js';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js';

export function BugMsg({ bugId }) {
  const [msgs, setMsgs] = useState([]);
  const [txt, setTxt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(null);

  useEffect(() => {
    if (!bugId) return;
    loadCurrentUser();
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugId]);

  async function loadCurrentUser() {
    try {
      const user = await authService.getCurrentUser();
      setLoggedinUser(user);
    } catch (err) {
      setLoggedinUser(null);
    }
  }

  async function loadMessages() {
    if (!bugId) return;
    setIsLoading(true);
    try {
      const msgs = await msgService.query({ aboutBugId: bugId });
      setMsgs(msgs);
    } catch (err) {
      showErrorMsg('Could not load messages');
    } finally {
      setIsLoading(false);
    }
  }

  async function onSendMsg(ev) {
    ev.preventDefault();
    const trimmedTxt = txt.trim();
    if (!trimmedTxt) return;
    if (!loggedinUser) return showErrorMsg('Please login to send a message');

    try {
      const savedMsg = await msgService.save({
        txt: trimmedTxt,
        aboutBugId: bugId,
      });
      setMsgs((prevMsgs) => [...prevMsgs, savedMsg]);
      setTxt('');
      showSuccessMsg('Message sent');
    } catch (err) {
      showErrorMsg('Could not send message');
    }
  }

  async function onRemoveMsg(msgId) {
    if (!loggedinUser?.isAdmin)
      return showErrorMsg('Only admins can delete messages');

    try {
      await msgService.remove(msgId);
      setMsgs((prevMsgs) => prevMsgs.filter((msg) => msg._id !== msgId));
      showSuccessMsg('Message deleted');
    } catch (err) {
      showErrorMsg('Could not delete message');
    }
  }

  return (
    <section className="bug-msg">
      <header className="bug-msg-header">
        <h4>Bug chat</h4>
        <button
          type="button"
          onClick={loadMessages}
        >
          Refresh
        </button>
      </header>

      <div className="chat-window">
        {isLoading && <p className="muted">Loading messages...</p>}
        {!isLoading && !msgs.length && (
          <p className="muted">No messages yet. Start the conversation.</p>
        )}
        {!isLoading &&
          msgs.map((msg) => {
            // Use byUser from populated data if available, otherwise fallback to byUserId
            const msgUserId = msg.byUser?._id || msg.byUserId;
            const isMine =
              loggedinUser &&
              (msgUserId === loggedinUser._id ||
                msgUserId?.toString() === loggedinUser._id?.toString());
            const userName = msg.byUser?.fullname || msg.byUser?.username;
            const label = isMine
              ? 'You'
              : userName
              ? userName
              : msgUserId
              ? `User ${msgUserId.toString().slice(-4)}`
              : 'Guest';
            const isAdmin = loggedinUser?.isAdmin;
            return (
              <article
                key={msg._id || msgUserId + msg.txt}
                className={`chat-line ${isMine ? 'mine' : 'theirs'}`}
              >
                <div className="chat-line-header">
                  <span className="author">{label}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      className="delete-msg-btn"
                      onClick={() => onRemoveMsg(msg._id)}
                      title="Delete message"
                    >
                      ×
                    </button>
                  )}
                </div>
                <p>{msg.txt}</p>
              </article>
            );
          })}
      </div>

      <form
        className="msg-form"
        onSubmit={onSendMsg}
      >
        <input
          type="text"
          value={txt}
          placeholder={
            loggedinUser ? 'Add a message' : 'Login to join the chat'
          }
          onChange={(ev) => setTxt(ev.target.value)}
          disabled={!loggedinUser}
        />
        <button
          type="submit"
          disabled={!loggedinUser}
        >
          Send
        </button>
      </form>
    </section>
  );
}
