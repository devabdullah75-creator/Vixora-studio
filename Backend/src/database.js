import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configuredStorage = process.env.STORAGE_DIR ?? resolve(backendDirectory, 'storage');
export const storageDirectory = isAbsolute(configuredStorage)
  ? configuredStorage
  : resolve(backendDirectory, configuredStorage);
const frontendDirectory = resolve(backendDirectory, '..', 'Frontend');
const pathIsInside = (directory, path) => {
  const relativePath = relative(directory, path);
  return relativePath === '' || (!relativePath.startsWith('..') && !isAbsolute(relativePath));
};
if (pathIsInside(frontendDirectory, storageDirectory)) {
  throw new Error('STORAGE_DIR must be outside the frontend web root.');
}
export const mediaDirectory = resolve(storageDirectory, 'media');
export const privateDirectory = resolve(storageDirectory, 'private');
export const temporaryDirectory = resolve(storageDirectory, 'tmp');

for (const directory of [storageDirectory, mediaDirectory, privateDirectory, temporaryDirectory]) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
}

const configuredDatabase = process.env.DATABASE_PATH ?? resolve(storageDirectory, 'vixora-store.sqlite');
const databasePath = isAbsolute(configuredDatabase)
  ? configuredDatabase
  : resolve(backendDirectory, configuredDatabase);
if (pathIsInside(frontendDirectory, databasePath)) {
  throw new Error('DATABASE_PATH must be outside the frontend web root.');
}
mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 });

export const database = new Database(databasePath);
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');
database.pragma('busy_timeout = 5000');

database.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    data TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    discount_price_cents INTEGER CHECK (discount_price_cents >= 0),
    category TEXT NOT NULL,
    version TEXT NOT NULL,
    features_json TEXT NOT NULL,
    compatibility_json TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'unpublished')),
    thumbnail_asset_id TEXT,
    preview_video_asset_id TEXT,
    gallery_asset_ids TEXT NOT NULL DEFAULT '[]',
    download_asset_id TEXT,
    created_by TEXT NOT NULL REFERENCES admins(id),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
  );
  CREATE INDEX IF NOT EXISTS products_public_idx
    ON products(status, deleted_at, featured, created_at);

  CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id),
    kind TEXT NOT NULL CHECK (kind IN ('thumbnail', 'gallery', 'previewVideo', 'downloadFile')),
    storage_name TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    original_name TEXT NOT NULL,
    size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS assets_product_idx ON assets(product_id, kind);
`);

database.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
