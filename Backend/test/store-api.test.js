import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { rm } from 'node:fs/promises';
import argon2 from 'argon2';

const temporaryRoot = mkdtempSync(join(tmpdir(), 'vixora-store-test-'));
const origin = 'http://localhost:5173';
const adminEmail = 'admin@example.test';
const adminPassword = 'a-long-test-password-2026';
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-only-session-secret-with-sufficient-entropy';
process.env.APP_ORIGIN = origin;
process.env.STORAGE_DIR = join(temporaryRoot, 'storage');
process.env.DATABASE_PATH = join(temporaryRoot, 'store.sqlite');

const { createApp } = await import('../src/app.js');
const { database } = await import('../src/database.js');
let server;
let baseUrl;
let sessionCookie;

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  database.close();
  await rm(temporaryRoot, { recursive: true, force: true });
});

const api = (path, options = {}, authenticated = true) => {
  const headers = new Headers(options.headers);
  headers.set('Origin', origin);
  if (authenticated && sessionCookie) headers.set('Cookie', sessionCookie);
  return fetch(`${baseUrl}${path}`, { ...options, headers });
};

const formFor = (product, files = []) => {
  const form = new FormData();
  form.append('product', JSON.stringify(product));
  for (const [field, content, name, mimeType] of files) {
    form.append(field, new Blob([content], { type: mimeType }), name);
  }
  return form;
};

const productData = (overrides = {}) => ({
  title: 'Motion Toolkit',
  slug: 'motion-toolkit',
  shortDescription: 'Tools for independent motion designers.',
  fullDescription: 'A focused set of reusable motion design assets.',
  price: 24.5,
  discountPrice: null,
  category: 'Motion',
  version: '1.0',
  features: ['Reusable templates'],
  compatibility: ['After Effects'],
  featured: true,
  status: 'draft',
  galleryAssetIds: [],
  removeThumbnail: false,
  removePreviewVideo: false,
  removeDownloadFile: false,
  ...overrides,
});

test('protects the admin API and serves only published products', async () => {
  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
  database.prepare('INSERT INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
    .run(randomUUID(), adminEmail, passwordHash, new Date().toISOString());

  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const forbiddenOverview = await api('/api/admin/overview', {}, false);
  assert.equal(forbiddenOverview.status, 401);
  const anonymousSession = await api('/api/auth/me', {}, false);
  assert.equal(anonymousSession.status, 200);
  assert.equal((await anonymousSession.json()).admin, null);

  const crossOriginLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  assert.equal(crossOriginLogin.status, 403);

  const login = await api('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  }, false);
  assert.equal(login.status, 200);
  sessionCookie = login.headers.get('set-cookie')?.split(';')[0];
  assert.ok(sessionCookie);

  const unauthorizedCreate = await api('/api/admin/products', {
    method: 'POST',
    body: formFor(productData()),
  }, false);
  assert.equal(unauthorizedCreate.status, 401);

  const draftResponse = await api('/api/admin/products', {
    method: 'POST',
    body: formFor(productData()),
  });
  assert.equal(draftResponse.status, 201);
  const draft = (await draftResponse.json()).product;
  assert.equal(draft.status, 'draft');
  assert.equal(draft.price, 24.5);

  const publicDrafts = await api('/api/products', {}, false);
  assert.deepEqual((await publicDrafts.json()).products, []);
  const privateDetail = await api('/api/products/motion-toolkit', {}, false);
  assert.equal(privateDetail.status, 404);

  const publishedStatus = await api(`/api/admin/products/${draft.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'published' }),
  });
  assert.equal(publishedStatus.status, 200);

  const publicProducts = await api('/api/products', {}, false);
  const published = (await publicProducts.json()).products[0];
  assert.equal(published.slug, 'motion-toolkit');
  assert.equal(published.status, 'published');
  assert.equal('downloadFile' in published, false);
  assert.equal('downloadAssetId' in published, false);

  const update = await api(`/api/admin/products/${draft.id}`, {
    method: 'PUT',
    body: formFor(productData({
      title: 'Motion Toolkit Plus',
      slug: 'motion-toolkit-plus',
      price: 29,
      status: 'published',
    })),
  });
  assert.equal(update.status, 200);
  const publicDetail = await api('/api/products/motion-toolkit-plus', {}, false);
  assert.equal((await publicDetail.json()).product.price, 29);

  const uploadedProductResponse = await api('/api/admin/products', {
    method: 'POST',
    body: formFor(productData({
      title: 'Private Download',
      slug: 'private-download',
      status: 'published',
      featured: false,
    }), [
      ['thumbnail', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64'), 'cover.png', 'image/png'],
      ['downloadFile', Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00]), 'source.zip', 'application/zip'],
    ]),
  });
  assert.equal(uploadedProductResponse.status, 201);
  const uploadedProduct = (await uploadedProductResponse.json()).product;
  assert.ok(uploadedProduct.thumbnail.id);
  assert.ok(uploadedProduct.downloadFile.id);
  assert.equal(uploadedProduct.downloadFile.url, null);

  const publicUploaded = await api('/api/products/private-download', {}, false);
  const publicUploadedProduct = (await publicUploaded.json()).product;
  assert.equal('downloadFile' in publicUploadedProduct, false);
  const publicMedia = await api(`/api/media/${uploadedProduct.thumbnail.id}`, {}, false);
  assert.equal(publicMedia.status, 200);
  const guessedDownload = await api(`/api/media/${uploadedProduct.downloadFile.id}`, {}, false);
  assert.equal(guessedDownload.status, 404);

  const removeThumbnail = await api(`/api/admin/products/${uploadedProduct.id}`, {
    method: 'PUT',
    body: formFor(productData({
      title: 'Private Download',
      slug: 'private-download',
      status: 'published',
      featured: false,
      removeThumbnail: true,
    })),
  });
  assert.equal(removeThumbnail.status, 200);
  assert.equal((await api(`/api/media/${uploadedProduct.thumbnail.id}`, {}, false)).status, 404);

  const invalidAssetResponse = await api('/api/admin/products', {
    method: 'POST',
    body: formFor(productData({
      title: 'Invalid Upload',
      slug: 'invalid-upload',
    }), [
      ['thumbnail', Buffer.from('not an image'), 'wrong.png', 'image/png'],
    ]),
  });
  assert.equal(invalidAssetResponse.status, 415);

  const unpublished = await api(`/api/admin/products/${uploadedProduct.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'unpublished' }),
  });
  assert.equal(unpublished.status, 200);
  assert.equal((await api('/api/products/private-download', {}, false)).status, 404);
  assert.equal((await api(`/api/media/${uploadedProduct.thumbnail.id}`, {}, false)).status, 404);

  const deleted = await api(`/api/admin/products/${draft.id}`, { method: 'DELETE' });
  assert.equal(deleted.status, 204);
  assert.equal((await api('/api/products/motion-toolkit-plus', {}, false)).status, 404);

  const logout = await api('/api/auth/logout', { method: 'POST' });
  assert.equal(logout.status, 204);
  assert.equal((await api('/api/admin/products', {}, false)).status, 401);
});
