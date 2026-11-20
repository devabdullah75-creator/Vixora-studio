import session from 'express-session';
import { database } from './database.js';

export class SQLiteSessionStore extends session.Store {
  get(sid, callback) {
    try {
      const row = database.prepare('SELECT expires_at, data FROM sessions WHERE sid = ?').get(sid);
      if (!row) return callback(null, null);
      if (row.expires_at <= Date.now()) {
        database.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
        return callback(null, null);
      }
      return callback(null, JSON.parse(row.data));
    } catch (error) {
      return callback(error);
    }
  }

  set(sid, sessionData, callback) {
    try {
      const expiresAt = sessionData.cookie?.expires
        ? new Date(sessionData.cookie.expires).getTime()
        : Date.now() + 8 * 60 * 60 * 1000;
      database.prepare(`
        INSERT INTO sessions (sid, expires_at, data) VALUES (?, ?, ?)
        ON CONFLICT(sid) DO UPDATE SET expires_at = excluded.expires_at, data = excluded.data
      `).run(sid, expiresAt, JSON.stringify(sessionData));
      callback?.(null);
    } catch (error) {
      callback?.(error);
    }
  }

  touch(sid, sessionData, callback) {
    try {
      const expiresAt = sessionData.cookie?.expires
        ? new Date(sessionData.cookie.expires).getTime()
        : Date.now() + 8 * 60 * 60 * 1000;
      database.prepare('UPDATE sessions SET expires_at = ? WHERE sid = ?').run(expiresAt, sid);
      callback?.(null);
    } catch (error) {
      callback?.(error);
    }
  }

  destroy(sid, callback) {
    try {
      database.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
      callback?.(null);
    } catch (error) {
      callback?.(error);
    }
  }
}
